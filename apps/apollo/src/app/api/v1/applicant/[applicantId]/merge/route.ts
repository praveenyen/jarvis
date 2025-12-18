import { NextResponse, NextRequest } from 'next/server';
import ServerAuthHelper from '@/auth/ServerAuthHelper';

import HttpClientException from '@/lib/exceptions/HttpClientException';
import { mergeApplicant } from '@/lib/queries/vision/services';
import { normalizeErrorObject } from '@/lib/utils/routeHandlerUtils';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ applicantId: number }> },
) {
  try {
    const token = await ServerAuthHelper.getTokenFromCookies();
    const authHeaders = ServerAuthHelper.getAuthHeader(token);

    const applicantId = (await params).applicantId;
    const body: { matchingApplicantId: string } = await request.json();

    const res = await mergeApplicant(
      applicantId,
      body.matchingApplicantId,
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
