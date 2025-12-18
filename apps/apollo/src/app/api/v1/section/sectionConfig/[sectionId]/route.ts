import ServerAuthHelper from '@/auth/ServerAuthHelper';
import { errorDetails } from '@/lib/exceptions/AppException';
import HttpClientException from '@/lib/exceptions/HttpClientException';
import {
  getAddSectionListItem,
  getDocAppForm,
  getSectionDetails,
} from '@/lib/queries/drStrange/service';
import { normalizeErrorObject } from '@/lib/utils/routeHandlerUtils';
import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ sectionId: string }> },
) {
  const token = await ServerAuthHelper.getTokenFromCookies();
  const authHeaders = ServerAuthHelper.getAuthHeader(token);
  try {
    const sectionId = (await params).sectionId;
    const res = await getSectionDetails(sectionId, authHeaders);
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
