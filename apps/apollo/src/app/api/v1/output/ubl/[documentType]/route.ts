import ServerAuthHelper from '@/auth/ServerAuthHelper';
import { NextRequest, NextResponse } from 'next/server';
import HttpClientException from '@/lib/exceptions/HttpClientException';
import { normalizeErrorObject } from '@/lib/utils/routeHandlerUtils';
import { getDocUBLGamora } from '@/lib/queries/gamora/service';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ documentType: string }> },
) {
  const token = await ServerAuthHelper.getTokenFromCookies();
  const authHeaders = ServerAuthHelper.getAuthHeader(token);
  try {
    const documentType = (await params).documentType;
    const { searchParams } = request.nextUrl;
    const roles = searchParams.get('roles');

    const res = await getDocUBLGamora(roles, documentType, authHeaders);
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
