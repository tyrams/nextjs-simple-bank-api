import { NextRequest, NextResponse } from "next/server";
import { createCustomer, getAllCustomersWithBalances } from "@/lib/services/customerService";
import { isAppError } from "@/lib/errors";

export async function GET() {
  try {
    const customers = await getAllCustomersWithBalances();
    return NextResponse.json(customers);
  } catch (error) {
    if (isAppError(error)) {
      return NextResponse.json(
        { error: error.message, details: error.details },
        { status: error.statusCode }
      );
    }
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const customer = await createCustomer(body);
    return NextResponse.json(customer, { status: 201 });
  } catch (error) {
    if (isAppError(error)) {
      return NextResponse.json(
        { error: error.message, details: error.details },
        { status: error.statusCode }
      );
    }
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
