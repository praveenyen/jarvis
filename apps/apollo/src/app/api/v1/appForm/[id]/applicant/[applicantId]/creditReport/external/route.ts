import ServerAuthHelper from "@/auth/ServerAuthHelper";
import { BureauCreditReport } from "@/components/bureau/bureauType";
import HttpClientException from "@/lib/exceptions/HttpClientException";
import { uploadBureauDoc } from "@/lib/queries/bureauEngine/services";
import { normalizeErrorObject } from "@/lib/utils/routeHandlerUtils";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string; applicantId: string }> },
  ) {
    const token = await ServerAuthHelper.getTokenFromCookies();
    const authHeaders = ServerAuthHelper.getAuthHeader(token);
    const bureauCreditReport: BureauCreditReport = await request.json();
  
    try {
      const appFormId = (await params).id;
      const applicantId = (await params).applicantId;
  
      const res = await uploadBureauDoc(appFormId, applicantId, bureauCreditReport,authHeaders);
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
  