import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  return NextResponse.json(
    { message: 'Hello from Health Check' },
    { status: 200 },
  );
}
