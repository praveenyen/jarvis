import ServerAuthHelper from '@/auth/ServerAuthHelper';
import { NextRequest, NextResponse } from 'next/server';
import HttpClientException from '@/lib/exceptions/HttpClientException';
import { errorDetails } from '@/lib/exceptions/AppException';
import {
  getAppFormStatus,
  getStatusReasons,
  updateAppFormStatus,
} from '@/lib/queries/shield/services';
import { TLoanStatusUpdateReq } from '@/lib/queries/shield/queryResponseTypes';
import { normalizeErrorObject } from '@/lib/utils/routeHandlerUtils';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const token = await ServerAuthHelper.getTokenFromCookies();
    const authHeaders = ServerAuthHelper.getAuthHeader(token);
    const appFormId = (await params).id;
    const res = await getAppFormStatus(appFormId, authHeaders);
    return NextResponse.json(res, { status: 200 });
  } catch (error: unknown) {
    let details: errorDetails = {
      message: (error as Error).message,
      stack: (error as Error).stack,
    };
    let statusCode = 500;
    if (error instanceof HttpClientException) {
      statusCode = error.statusCode ? error.statusCode : 500;
    }

    return NextResponse.json({ ...details }, { status: statusCode });
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const token = await ServerAuthHelper.getTokenFromCookies();
  const authHeaders = ServerAuthHelper.getAuthHeader(token);
  try {
    const appFormId = (await params).id;
    const updateRequest: TLoanStatusUpdateReq = await request.json();
    const res = await updateAppFormStatus(
      appFormId,
      updateRequest,
      authHeaders,
    );
    return NextResponse.json(res, { status: 200 });
  } catch (error: unknown) {
    let statusCode = 500;
    if (error instanceof HttpClientException) {
      statusCode = error.statusCode ? error.statusCode : 500;
      return NextResponse.json(
        {
          ...normalizeErrorObject(error.getErrorResp()),
        },
        { status: statusCode },
      );
    }
    return NextResponse.json(
      { message: (error as Error).message },
      { status: statusCode },
    );
  }
}
