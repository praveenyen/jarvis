import ServerAuthHelper from '@/auth/ServerAuthHelper';
import { errorDetails } from '@/lib/exceptions/AppException';
import HttpClientException from '@/lib/exceptions/HttpClientException';
import { getPreSignedUrl } from '@/lib/queries/drStrange/service';
import { NextResponse } from 'next/server';
import { ParamsType } from '@/lib/queries/drStrange/queryResponseTypes';
import { PreSignedUrlResp } from '@/components/documents/DocumentScreenType';

export async function GET(request: Request) {
  const token = await ServerAuthHelper.getTokenFromCookies();
  const authHeaders = ServerAuthHelper.getAuthHeader(token);

  const url = new URL(request.url);
  const paramsUrl: { [k: string]: string } = Object.fromEntries(
    url.searchParams,
  );

  const params: ParamsType = {
    method: paramsUrl.method,
    objectKey: paramsUrl.objectKey,
  };
  try {
    const res: PreSignedUrlResp = await getPreSignedUrl(params, authHeaders);
    return NextResponse.json(res);
  } catch (error: unknown) {
    let details: errorDetails = {
      message: (error as Error).message,
      stack: (error as Error).stack,
    };
    let statusCode = 500;
    if (error instanceof HttpClientException) {
      statusCode = error.statusCode ? error.statusCode : 500;
    }
    return NextResponse.json({ ...details }, { status: statusCode });
  }
}
