import ServerAuthHelper from '@/auth/ServerAuthHelper';
import { NextRequest, NextResponse } from 'next/server';
import HttpClientException from '@/lib/exceptions/HttpClientException';
import { approveRegCheck } from '@/lib/queries/deadpool/services';
import { UpdateRegCheckRequest } from '@/lib/queries/deadpool/queryResponseTypes';
import { normalizeErrorObject } from '@/lib/utils/routeHandlerUtils';
import { getCreditData } from '@/lib/queries/cerebro/service';
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; applicantId: string }> },
) {
  const token = await ServerAuthHelper.getTokenFromCookies();
  const authHeaders = ServerAuthHelper.getAuthHeader(token);
  try {
    const appFormId = (await params).id;
    const applicantId = (await params).applicantId;
    const { searchParams } = new URL(request.url);

    const res = await getCreditData(
      appFormId,
      applicantId,
      searchParams.get('bureauName'),
      authHeaders,
      {
        revalidateSec: 3600 * 10,
      },
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
