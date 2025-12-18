import ServerAuthHelper from '@/auth/ServerAuthHelper';
import { NextRequest, NextResponse } from 'next/server';
import HttpClientException from '@/lib/exceptions/HttpClientException';
import { normalizeErrorObject } from '@/lib/utils/routeHandlerUtils';
import { getCreditReport } from '@/lib/queries/bureauEngine/services';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ bureauPullId: string }> },
) {
  const token = await ServerAuthHelper.getTokenFromCookies();
  const authHeaders = ServerAuthHelper.getAuthHeader(token);
  try {
    const bureauPullId = (await params).bureauPullId;
    const { searchParams } = request.nextUrl;
    const bureauName = searchParams.get('bureauName');
    const res = await getCreditReport(
      bureauPullId,
      bureauName || '',
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
