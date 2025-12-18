import ServerAuthHelper from '@/auth/ServerAuthHelper';
import { NextResponse } from 'next/server';
import HttpClientException from '@/lib/exceptions/HttpClientException';
import IHttpClient, { CacheConfig } from '@/lib/httpClient/IHttpClient';
import HttpClientFactory from '@/lib/httpClient/HttpClientFactory';
import { normalizeErrorObject } from '@/lib/utils/routeHandlerUtils';

/**TODO @subiksha conver to a service if this is beingused */
const fetchClient: IHttpClient = HttpClientFactory.getHttpClient('fetch');

const MORPHEUS_SERVER = process.env.MORPHEUS_SERVER;

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const token = await ServerAuthHelper.getTokenFromCookies();
  const authHeaders = ServerAuthHelper.getAuthHeader(token);
  try {
    const appFormId = (await params).id;
    const url = MORPHEUS_SERVER + `appForm/${appFormId}/internal`;
    const res = await fetchClient.get<Record<string, any>>(
      url,
      undefined,
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
