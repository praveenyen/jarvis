import { NextResponse } from 'next/server';
import ServerAuthHelper from '@/auth/ServerAuthHelper';
import { TKycCustomStatusInput } from '@/lib/queries/hulk/queryResponseTypes';
import { updateKycData } from '@/lib/queries/hulk/services';
import HttpClientException from '@/lib/exceptions/HttpClientException';
import { normalizeErrorObject } from '@/lib/utils/routeHandlerUtils';

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ applicantId: string; kycId: string }> },
) {
  try {
    const token = await ServerAuthHelper.getTokenFromCookies();
    const authHeaders = ServerAuthHelper.getAuthHeader(token);
    const { applicantId, kycId } = await params;

    const body: TKycCustomStatusInput = await request.json();

    const res = await updateKycData(Number(applicantId), body, authHeaders);

    return NextResponse.json(res, { status: 200 });

    //return NextResponse.json({ status: 200 });
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
