import { NextRequest, NextResponse } from 'next/server';
import ServerAuthHelper from '@/auth/ServerAuthHelper';
import { TAppFormStageStatus } from '@/lib/queries/shield/queryResponseTypes';
import { updateMCUStage } from '@/lib/queries/shield/services';
import HttpClientException from '@/lib/exceptions/HttpClientException';
import { normalizeErrorObject } from '@/lib/utils/routeHandlerUtils';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const token = await ServerAuthHelper.getTokenFromCookies();
  const authHeaders = ServerAuthHelper.getAuthHeader(token);
  try {
    const appFormId = (await params).id;
    const updateRequest: TAppFormStageStatus = await request.json();
    const res = await updateMCUStage(appFormId, updateRequest, authHeaders);
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
