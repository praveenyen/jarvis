import { NextRequest, NextResponse } from 'next/server';
import ServerAuthHelper from '@/auth/ServerAuthHelper';
import { generateUniqueCustomer } from '@/lib/queries/vision/services';
import HttpClientException from '@/lib/exceptions/HttpClientException';
import { normalizeErrorObject } from '@/lib/utils/routeHandlerUtils';

export async function PUT(
  request: NextRequest,
  { params }: { params: { applicantId: string } },
) {
  try {
    const token = await ServerAuthHelper.getTokenFromCookies();
    const authHeaders = ServerAuthHelper.getAuthHeader(token);
    const { applicantId } = await params;

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');

    const res = await generateUniqueCustomer(
      Number(applicantId),
      status || '',
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
