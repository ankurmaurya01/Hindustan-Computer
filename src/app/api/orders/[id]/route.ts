import { NextRequest, NextResponse } from 'next/server';
import { Storage } from '@/lib/storage';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const order = await Storage.getOrderById(params.id);
    if (!order) {
      return NextResponse.json({ message: 'Order not found' }, { status: 404 });
    }
    return NextResponse.json(order);
  } catch (error: any) {
    return NextResponse.json({ message: error.message || 'Failed to fetch order' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await req.json();
    const { status, note, tracking, updatedBy } = body;

    if (!status) {
      return NextResponse.json({ message: 'New status is required' }, { status: 400 });
    }

    const updated = await Storage.updateOrderStatus(
      params.id,
      status,
      note,
      tracking,
      updatedBy || 'Administrator'
    );

    if (!updated) {
      return NextResponse.json({ message: 'Order not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, order: updated });
  } catch (error: any) {
    return NextResponse.json({ message: error.message || 'Failed to update order' }, { status: 500 });
  }
}
