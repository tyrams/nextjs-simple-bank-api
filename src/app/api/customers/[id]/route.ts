import { NextRequest, NextResponse } from 'next/server';
import { updateCustomer, deleteCustomer, getCustomer } from '@/lib/services/customerService';
import { updateAccount } from '@/lib/services/accountService';
import { isAppError, Errors } from '@/lib/errors';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const customer = await getCustomer(params.id);
    return NextResponse.json(customer);
  } catch (error) {
    if (isAppError(error)) {
      return NextResponse.json(
        { error: error.message },
        { status: error.statusCode }
      );
    }
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { customerData, accountData } = body;
    
    const results = {
      customer: null as any,
      account: null as any,
      success: [] as string[],
      failed: [] as string[]
    };

    try {
      if (customerData) {
        results.customer = await updateCustomer(params.id, customerData);
        results.success.push('customer');
      }
    } catch (error) {
      results.failed.push('customer');
    }

    try {
      if (accountData) {
        results.account = await updateAccount(params.id, accountData);
        results.success.push('account');
      }
    } catch (error) {
      results.failed.push('account');
    }

    if (results.failed.length > 0 && results.success.length > 0) {
      throw Errors.PartialUpdateError(results.success, results.failed);
    }

    if (results.failed.length === 0) {
      return NextResponse.json({
        message: 'Update successful',
        data: {
          customer: results.customer,
          account: results.account
        }
      });
    }

    throw Errors.DatabaseError('Update failed completely');
  } catch (error) {
    if (isAppError(error)) {
      return NextResponse.json(
        { 
          error: error.message,
          details: error.details,
          status: error.type
        },
        { status: error.statusCode }
      );
    }
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await deleteCustomer(params.id);
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    if (isAppError(error)) {
      return NextResponse.json(
        { error: error.message },
        { status: error.statusCode }
      );
    }
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}