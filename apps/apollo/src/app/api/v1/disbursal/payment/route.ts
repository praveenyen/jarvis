import ServerAuthHelper from '@/auth/ServerAuthHelper';
import { NewUtrSuccessPayload } from '@/components/disbursement/DisbursementCommonType';
import { errorDetails } from '@/lib/exceptions/AppException';
import HttpClientException from '@/lib/exceptions/HttpClientException';
import { putUtrPayment } from '@/lib/queries/spiderman/service';
import { normalizeErrorObject } from '@/lib/utils/routeHandlerUtils';
import { NextResponse } from 'next/server';

export async function PUT(request: Request) {
  const token = await ServerAuthHelper.getTokenFromCookies();
  const authHeaders = ServerAuthHelper.getAuthHeader(token);

  const body: NewUtrSuccessPayload = await request.json();
  try {

    const url = new URL(request.url);
    const paramsUrl: { [k: string]: string } = Object.fromEntries(
      url.searchParams,
    );

    const res = await putUtrPayment(body, paramsUrl.withdrawalId ? true : false ,authHeaders);


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
