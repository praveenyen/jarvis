import ServerAuthHelper from '@/auth/ServerAuthHelper';
import createApiWrapper from '@/lib/utils/axiosWrapper';
import { NextRequest, NextResponse } from 'next/server';
import HttpClientException from '@/lib/exceptions/HttpClientException';
import { approveRegCheck } from '@/lib/queries/deadpool/services';
import { UpdateRegCheckRequest } from '@/lib/queries/deadpool/queryResponseTypes';
import { normalizeErrorObject } from '@/lib/utils/routeHandlerUtils';
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const token = await ServerAuthHelper.getTokenFromCookies();
  const authHeaders = ServerAuthHelper.getAuthHeader(token);
  try {
    const appFormId = (await params).id;
    const updateRequest: UpdateRegCheckRequest = await request.json();
    const res = await approveRegCheck(appFormId, updateRequest, authHeaders);
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
