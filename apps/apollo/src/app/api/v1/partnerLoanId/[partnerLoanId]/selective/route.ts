import ServerAuthHelper from '@/auth/ServerAuthHelper';
import { NextRequest, NextResponse } from 'next/server';
import HttpClientException from '@/lib/exceptions/HttpClientException';
import { getAppFormBasicInfoByPartnerLoanId } from '@/lib/queries/shield/services';
import { normalizeErrorObject } from '@/lib/utils/routeHandlerUtils';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ partnerLoanId: string }> },
): Promise<NextResponse> {
  const token = await ServerAuthHelper.getTokenFromCookies();
  const authHeaders = ServerAuthHelper.getAuthHeader(token);
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get('details');
  try {
    const partnerLoanId = (await params).partnerLoanId;
    const res = await getAppFormBasicInfoByPartnerLoanId(
      partnerLoanId,
      query,
      authHeaders,
    );
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
