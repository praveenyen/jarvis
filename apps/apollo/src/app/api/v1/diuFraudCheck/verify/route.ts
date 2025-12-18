import { NextResponse } from 'next/server';
import ServerAuthHelper from '@/auth/ServerAuthHelper';
import HttpClientException from '@/lib/exceptions/HttpClientException';
import { normalizeErrorObject } from '@/lib/utils/routeHandlerUtils';
import { mnrlFriFraudCheckVerify } from '@/lib/queries/rogue/services';
import { MnrlFriDiuReq } from '@/lib/queries/rogue/queryResponseTypes';
export async function POST(request: Request) {
  try {
    const token = await ServerAuthHelper.getTokenFromCookies();
    const authHeaders = ServerAuthHelper.getAuthHeader(token);

    const body: MnrlFriDiuReq = await request.json();

    const res = await mnrlFriFraudCheckVerify(body, authHeaders);

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
