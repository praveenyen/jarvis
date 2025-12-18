import { NextResponse } from 'next/server';
import ServerAuthHelper from '@/auth/ServerAuthHelper';
import { TExposureInput } from '@/lib/queries/vision/queryResponseTypes';
import { calculateExposure } from '@/lib/queries/vision/services';
import HttpClientException from '@/lib/exceptions/HttpClientException';
import { normalizeErrorObject } from '@/lib/utils/routeHandlerUtils';
export async function POST(request: Request) {
  try {
    const token = await ServerAuthHelper.getTokenFromCookies();
    const authHeaders = ServerAuthHelper.getAuthHeader(token);

    const body: TExposureInput = await request.json();

    const res = await calculateExposure(body, authHeaders);

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
