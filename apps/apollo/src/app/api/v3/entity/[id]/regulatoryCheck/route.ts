import ServerAuthHelper from '@/auth/ServerAuthHelper';
import { NextRequest, NextResponse } from 'next/server';
import HttpClientException from '@/lib/exceptions/HttpClientException';
import { approveRegCheckV3 } from '@/lib/queries/deadpool/services';
import { UpdateRegCheckRequest, UpdateRegCheckRequestV3 } from '@/lib/queries/deadpool/queryResponseTypes';
import { normalizeErrorObject } from '@/lib/utils/routeHandlerUtils';
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const token = await ServerAuthHelper.getTokenFromCookies();
  const authHeaders = ServerAuthHelper.getAuthHeader(token);
  try {
    const appFormId = (await params).id;
    const updateRequest: UpdateRegCheckRequestV3 = await request.json();
    const res = await approveRegCheckV3(appFormId, updateRequest, {env:process.env.ENV_TYPE as string,...authHeaders});
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
