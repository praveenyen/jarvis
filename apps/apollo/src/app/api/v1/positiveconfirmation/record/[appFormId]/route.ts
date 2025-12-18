import ServerAuthHelper from '@/auth/ServerAuthHelper';
import createApiWrapper from '@/lib/utils/axiosWrapper';
import { NextRequest, NextResponse } from 'next/server';
import { getAppFormData, updateAppForm } from '@/lib/queries/shield/services';
import HttpClientException from '@/lib/exceptions/HttpClientException';
import { normalizeErrorObject } from '@/lib/utils/routeHandlerUtils';
import { TPositiveConfirmationRecordResponse } from '@/lib/queries/kaizen/queryResponseTypes';
import {
  getPositiveConfirmationRecord,
  updatePositiveConfirmation,
} from '@/lib/queries/kaizen/service';
export async function GET(
  request: Request,
  { params }: { params: Promise<{ appFormId: string }> },
) {
  const token = await ServerAuthHelper.getTokenFromCookies();
  const authHeaders = ServerAuthHelper.getAuthHeader(token);
  try {
    const appFormId = (await params).appFormId;
    const res = await getPositiveConfirmationRecord(appFormId, authHeaders);
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

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ appFormId: string }> },
) {
  const token = await ServerAuthHelper.getTokenFromCookies();
  const authHeaders = ServerAuthHelper.getAuthHeader(token);
  try {
    const appFormId = (await params).appFormId;
    const updateRequest: Record<string, string> = await request.json();
    const res = await updatePositiveConfirmation(
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
