import ServerAuthHelper from '@/auth/ServerAuthHelper';
import { errorDetails } from '@/lib/exceptions/AppException';
import HttpClientException from '@/lib/exceptions/HttpClientException';
import {
  ParamsType,
  ParamsTypeDMSCompelete,
} from '@/lib/queries/drStrange/queryResponseTypes';
import {
  getAddSectionListItem,
  getDocAppForm,
  getUrlS3,
  setCompeleteDms,
} from '@/lib/queries/drStrange/service';
import { normalizeErrorObject } from '@/lib/utils/routeHandlerUtils';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const token = await ServerAuthHelper.getTokenFromCookies();
  const authHeaders = ServerAuthHelper.getAuthHeader(token);

  try {
    const appFormId = (await params).id;
    const url = new URL(request.url);
    const paramsUrl: { [k: string]: string } = Object.fromEntries(
      url.searchParams,
    );

    const queryParams: ParamsTypeDMSCompelete = {
      loanProductCode: paramsUrl.lpc,
    };

    const res = await setCompeleteDms(
      appFormId,
      queryParams.loanProductCode,
      authHeaders,
    );
    return NextResponse.json(res);
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
