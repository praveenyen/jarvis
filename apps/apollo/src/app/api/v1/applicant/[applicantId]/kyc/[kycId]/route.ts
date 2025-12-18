import { resolveKyc } from '@/lib/queries/hulk/services';
import { getKyc } from '@/lib/queries/shield/services';
import { NextResponse } from 'next/server';
import ServerAuthHelper from '@/auth/ServerAuthHelper';
import { TKycInfo } from '@/lib/queries/hulk/queryResponseTypes';
import { Kyc } from '@/lib/queries/shield/queryResponseTypes';
import HttpClientException from '@/lib/exceptions/HttpClientException';
import { normalizeErrorObject } from '@/lib/utils/routeHandlerUtils';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ applicantId: string; kycId: string }> },
) {
  try {
    const token = await ServerAuthHelper.getTokenFromCookies();
    const authHeaders = ServerAuthHelper.getAuthHeader(token);

    const { applicantId, kycId } = await params;

    const res = await getKyc(applicantId, kycId, authHeaders);
    return NextResponse.json(res, { status: 200 });
  } catch (error: any) {

    return NextResponse.json(
      {
        error: 'An unexpected error occurred',
        details: {
          message: error.message,
          stack: error.stack,
        },
      },
      { status: 500 },
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ applicantId: string; kycId: string }> },
) {
  try {
    const token = await ServerAuthHelper.getTokenFromCookies();
    const authHeaders = ServerAuthHelper.getAuthHeader(token);
    const { applicantId, kycId } = await params;

    const body: Kyc = await request.json();

    const res = await resolveKyc(
      Number(applicantId),
      Number(kycId),
      body,
      authHeaders,
    );

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
