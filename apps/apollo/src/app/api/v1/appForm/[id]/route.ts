import ServerAuthHelper from '@/auth/ServerAuthHelper';
import createApiWrapper from '@/lib/utils/axiosWrapper';
import { NextRequest, NextResponse } from 'next/server';
import { getAppFormData, updateAppForm } from '@/lib/queries/shield/services';
import HttpClientException from '@/lib/exceptions/HttpClientException';
import { normalizeErrorObject } from '@/lib/utils/routeHandlerUtils';
import { TAppFormEditRequest } from '@/lib/queries/shield/queryResponseTypes';
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const token = await ServerAuthHelper.getTokenFromCookies();
  const authHeaders = ServerAuthHelper.getAuthHeader(token);
  try {
    const appFormId = (await params).id;
    const res = await getAppFormData(appFormId, authHeaders);
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
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const token = await ServerAuthHelper.getTokenFromCookies();
  const authHeaders = ServerAuthHelper.getAuthHeader(token);
  const reqSubHeader = request.headers.get('requestingSub');

  try {
    const appFormId = (await params).id;
    const searchParams = request.nextUrl.searchParams;
    const checkAppFormStatus = searchParams.get('checkAppFormStatus');
    const reRunCpcChecks = searchParams.get('reRunCpcChecks');
    const validationRequired = searchParams.get('validationRequired');
    const updateRequest: TAppFormEditRequest = await request.json();

    let paramsToService: Record<string, boolean | string> = {};
    if (checkAppFormStatus !== null)
      paramsToService['checkAppFormStatus'] = checkAppFormStatus;
    if (reRunCpcChecks !== null)
      paramsToService['reRunCpcChecks'] = reRunCpcChecks;
    if (validationRequired !== null)
      paramsToService['validationRequired'] = validationRequired;

    const res = await updateAppForm(
      appFormId,
      updateRequest,
      { requestingSub: reqSubHeader || '', ...authHeaders },
      paramsToService,
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
