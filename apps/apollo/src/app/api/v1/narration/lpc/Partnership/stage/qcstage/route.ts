import { NextResponse } from 'next/server';
import ServerAuthHelper from '@/auth/ServerAuthHelper';
import { getNarrations } from '@/lib/queries/kaizen/service';

export async function GET(
  request: Request,
) {
  try {
    const token = await ServerAuthHelper.getTokenFromCookies();
    const authHeaders = ServerAuthHelper.getAuthHeader(token);

    const res = await getNarrations( authHeaders);
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

