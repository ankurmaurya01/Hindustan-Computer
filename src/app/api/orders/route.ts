import { NextRequest, NextResponse } from 'next/server';
import { Storage } from '@/lib/storage';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status') || undefined;
    const search = searchParams.get('search') || undefined;

    const orders = await Storage.getOrders({ status, search });
    return NextResponse.json(orders);
  } catch (error: any) {
    return NextResponse.json({ message: error.message || 'Failed to fetch orders' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (!body.customer || !body.shippingAddress || !body.items || body.items.length === 0) {
      return NextResponse.json({ message: 'Customer, shipping address, and order items are required' }, { status: 400 });
    }

    const order = await Storage.createOrder(body);
    return NextResponse.json({ success: true, order }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message || 'Failed to place order' }, { status: 400 });
  }
}
