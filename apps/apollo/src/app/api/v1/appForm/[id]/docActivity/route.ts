import ServerAuthHelper from '@/auth/ServerAuthHelper';
import { DocActivity } from '@/components/documents/DocumentScreenType';
import HttpClientException from '@/lib/exceptions/HttpClientException';
import {
  getDocActivity,
} from '@/lib/queries/drStrange/service';
import { normalizeErrorObject } from '@/lib/utils/routeHandlerUtils';
import { NextResponse } from 'next/server';

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> },) {
  const token = await ServerAuthHelper.getTokenFromCookies();
  const authHeaders = ServerAuthHelper.getAuthHeader(token);

  try {
    const url = new URL(request.url);
    const paramsUrl: { [k: string]: string; } = Object.fromEntries(url.searchParams);
    const appFormId = (await params).id;


    const res = await getDocActivity(paramsUrl as DocActivity, appFormId, authHeaders);
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
