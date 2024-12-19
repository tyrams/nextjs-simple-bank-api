import { NextRequest, NextResponse } from 'next/server';
import { createAccount } from '@/lib/services/accountService';
import { isAppError } from '@/lib/errors';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const account = await createAccount(params.id, body);
    return NextResponse.json(account, { status: 201 });
  } catch (error) {
    if (isAppError(error)) {
      return NextResponse.json(
        { error: error.message, details: error.details },
        { status: error.statusCode }
      );
    }
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}