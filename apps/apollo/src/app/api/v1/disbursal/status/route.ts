import ServerAuthHelper from '@/auth/ServerAuthHelper';
import { rejectedStatusPayload } from '@/components/disbursement/DisbursementCommonType';
import { errorDetails } from '@/lib/exceptions/AppException';
import HttpClientException from '@/lib/exceptions/HttpClientException';
import { getResonForReject, putResonForReject } from '@/lib/queries/spiderman/service';
import { normalizeErrorObject } from '@/lib/utils/routeHandlerUtils';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const token = await ServerAuthHelper.getTokenFromCookies();
  const authHeaders = ServerAuthHelper.getAuthHeader(token);

  try {
    const res = await getResonForReject(authHeaders);

    return NextResponse.json(res);
  } catch (error: unknown) {
    let statusCode = 500;
    if (error instanceof HttpClientException) {
      statusCode = error.statusCode ?? 500;
      return NextResponse.json(
        { ...normalizeErrorObject(error.getErrorResp()) },
        { status: statusCode },
      );
    }
    return NextResponse.json(
      { message: (error as Error).message },
      { status: statusCode },
    );
  }
}
export async function PUT(request: Request) {
  const token = await ServerAuthHelper.getTokenFromCookies();
  const authHeaders = ServerAuthHelper.getAuthHeader(token);

  const body: rejectedStatusPayload = await request.json();


  try {
    const res = await putResonForReject(body,authHeaders);

    return NextResponse.json(res);
  } catch (error: unknown) {
    let statusCode = 500;
    if (error instanceof HttpClientException) {
      statusCode = error.statusCode ?? 500;
      return NextResponse.json(
        { ...normalizeErrorObject(error.getErrorResp()) },
        { status: statusCode },
      );
    }
    return NextResponse.json(
      { message: (error as Error).message },
      { status: statusCode },
    );
  }
}
