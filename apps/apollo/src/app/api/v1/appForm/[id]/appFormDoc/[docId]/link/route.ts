import ServerAuthHelper from '@/auth/ServerAuthHelper';
import { NextRequest, NextResponse } from 'next/server';
import HttpClientException from '@/lib/exceptions/HttpClientException';
import { errorDetails } from '@/lib/exceptions/AppException';
import {
  getAppFormStatus,
  getStatusReasons,
  updateAppFormStatus,
} from '@/lib/queries/shield/services';
import { TLoanStatusUpdateReq } from '@/lib/queries/shield/queryResponseTypes';
import { normalizeErrorObject } from '@/lib/utils/routeHandlerUtils';
import {
  attachFileToSection,
  deleteFileToSection,
} from '@/lib/queries/drStrange/service';
import { DocumentMoveRequest } from '@/components/documents/DocumentScreenType';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; docId: string }> },
) {
  const token = await ServerAuthHelper.getTokenFromCookies();
  const authHeaders = ServerAuthHelper.getAuthHeader(token);
  try {
    const appFormId = (await params).id;
    const docId = (await params).docId;
    const updateRequest: DocumentMoveRequest = await request.json();
    const res = await attachFileToSection(
      appFormId,
      parseInt(docId),
      updateRequest,
      authHeaders,
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
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; docId: string }> },
) {
  const token = await ServerAuthHelper.getTokenFromCookies();
  const authHeaders = ServerAuthHelper.getAuthHeader(token);
  try {
    const appFormId = (await params).id;
    const docId = (await params).docId;
    console.log('server called');
    const res = await deleteFileToSection(appFormId, docId, authHeaders);
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
