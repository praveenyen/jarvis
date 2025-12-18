import ServerAuthHelper from '@/auth/ServerAuthHelper';
import { NextRequest, NextResponse } from 'next/server';
import { getLoanDetails } from '@/lib/queries/asgard/services';
import HttpClientException from '@/lib/exceptions/HttpClientException';
import { errorDetails } from '@/lib/exceptions/AppException';
import { normalizeErrorObject } from '@/lib/utils/routeHandlerUtils';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ appFormId: string }> },
) {
  const token = await ServerAuthHelper.getTokenFromCookies();
  const authHeaders = ServerAuthHelper.getAuthHeader(token);
  try {
    const appFormId = (await params).appFormId;
    console.log('appform id inside get', appFormId);
    const res = await getLoanDetails(appFormId, authHeaders);
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
