import { NextRequest, NextResponse } from 'next/server';
import { Storage } from '@/lib/storage';

export async function POST(req: NextRequest) {
  try {
    const { orderNumber, phone } = await req.json();

    if (!orderNumber || !phone) {
      return NextResponse.json({ message: 'Order number and mobile number are required' }, { status: 400 });
    }

    const order = await Storage.trackOrder(orderNumber, phone);
    if (!order) {
      return NextResponse.json(
        { message: 'No matching order found. Please verify your Order Number and registered 10-digit Mobile Number.' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      order: {
        orderNumber: order.orderNumber,
        status: order.status,
        createdAt: order.createdAt,
        items: order.items,
        financials: order.financials,
        shippingAddress: {
          city: order.shippingAddress.city,
          state: order.shippingAddress.state,
          pinCode: order.shippingAddress.pinCode,
        },
        tracking: order.tracking,
        statusHistory: order.statusHistory,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ message: error.message || 'Tracking failed' }, { status: 500 });
  }
}
