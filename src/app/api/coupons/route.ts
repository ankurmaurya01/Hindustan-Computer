import { NextRequest, NextResponse } from 'next/server';
import { Storage } from '@/lib/storage';

export async function GET() {
  try {
    const coupons = await Storage.getCoupons();
    return NextResponse.json(coupons);
  } catch (error: any) {
    return NextResponse.json({ message: error.message || 'Failed to fetch coupons' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.code || !body.discountValue) {
      return NextResponse.json({ message: 'Coupon code and discount value are required' }, { status: 400 });
    }
    const coupon = await Storage.createCoupon(body);
    return NextResponse.json({ success: true, coupon }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message || 'Failed to create coupon' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ message: 'Coupon ID is required' }, { status: 400 });
    }
    await Storage.deleteCoupon(id);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ message: error.message || 'Failed to delete coupon' }, { status: 500 });
  }
}
