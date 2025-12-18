import { NextResponse } from 'next/server';
import ServerAuthHelper from '@/auth/ServerAuthHelper';
import { DiscrepancyList } from '@/lib/queries/kaizen/queryResponseTypes';
import HttpClientException from '@/lib/exceptions/HttpClientException';
import { normalizeErrorObject } from '@/lib/utils/routeHandlerUtils';
import { addDiscrepancy, getDiscrepancyData, updateDiscrepancy } from '@/lib/queries/kaizen/service';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const token = await ServerAuthHelper.getTokenFromCookies();
    const authHeaders = ServerAuthHelper.getAuthHeader(token);

    const { id } = await params;

    const res = await getDiscrepancyData(id, authHeaders);
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

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const token = await ServerAuthHelper.getTokenFromCookies();
    const authHeaders = ServerAuthHelper.getAuthHeader(token);

    const { id } = await params;
    const body: DiscrepancyList = await request.json();

    const res = await addDiscrepancy(id, body, authHeaders);
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

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const token = await ServerAuthHelper.getTokenFromCookies();
    const authHeaders = ServerAuthHelper.getAuthHeader(token);

    const { id } = await params;
    const body: DiscrepancyList = await request.json();

    const res = await updateDiscrepancy(id, body, authHeaders);
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


