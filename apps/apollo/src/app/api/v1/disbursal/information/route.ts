import ServerAuthHelper from '@/auth/ServerAuthHelper';
import { errorDetails } from '@/lib/exceptions/AppException';
import HttpClientException from '@/lib/exceptions/HttpClientException';
import { ParamsType } from '@/lib/queries/drStrange/queryResponseTypes';
import { getDisbursementList } from '@/lib/queries/spiderman/service';
import { normalizeErrorObject } from '@/lib/utils/routeHandlerUtils';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const token = await ServerAuthHelper.getTokenFromCookies();
  const authHeaders = ServerAuthHelper.getAuthHeader(token);

  try {
    const url = new URL(request.url);
    const paramsUrl: { [k: string]: string } = Object.fromEntries(
      url.searchParams,
    );
    
    const status = decodeURIComponent(paramsUrl.status);
    const pageNumber = decodeURIComponent(paramsUrl.pageNumber);
    const productType = decodeURIComponent(paramsUrl.loanProductCode || '');
    const groupDateFrom = decodeURIComponent(paramsUrl.from || '');
    const groupDateTo = decodeURIComponent(paramsUrl.to || '');
    const groupId = decodeURIComponent(paramsUrl.groupId || '');
    const res = await getDisbursementList(status, pageNumber, productType ? JSON.parse(productType):undefined, groupDateFrom, groupDateTo,groupId,authHeaders);

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
