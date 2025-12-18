import ServerAuthHelper from '@/auth/ServerAuthHelper';
import { AadharXmlData } from '@/components/documents/DocumentScreenType';
import { errorDetails } from '@/lib/exceptions/AppException';
import HttpClientException from '@/lib/exceptions/HttpClientException';
import { ParamsType } from '@/lib/queries/drStrange/queryResponseTypes';
import {
  getAadahrXmlData,
  getAddSectionListItem,
  getDocAppForm,
  getUrlS3,
} from '@/lib/queries/drStrange/service';
import { normalizeErrorObject } from '@/lib/utils/routeHandlerUtils';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const token = await ServerAuthHelper.getTokenFromCookies();
  const authHeaders = ServerAuthHelper.getAuthHeader(token);

  try {
    const url = new URL(request.url);
    const paramsUrl: AadharXmlData = Object.fromEntries(url.searchParams);

    const res = await getAadahrXmlData(paramsUrl, authHeaders);
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
