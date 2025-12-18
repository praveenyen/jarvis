import { NextRequest, NextResponse } from 'next/server';
import ServerAuthHelper from '@/auth/ServerAuthHelper';
import HttpClientException from '@/lib/exceptions/HttpClientException';
import { getPartnerCodes } from '@/lib/queries/hera/services';
import { normalizeErrorObject } from '@/lib/utils/routeHandlerUtils';

export async function GET(request: NextRequest) {
  const token = await ServerAuthHelper.getTokenFromCookies();
  const authHeaders = ServerAuthHelper.getAuthHeader(token);
  try {
    const res = await getPartnerCodes(authHeaders, {
      revalidateSec: 3600 * 10,
    });
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
