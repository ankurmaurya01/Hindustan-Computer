import { NextRequest, NextResponse } from 'next/server';
import { Storage } from '@/lib/storage';

export async function POST(req: NextRequest) {
  try {
    const { code, subtotal } = await req.json();

    if (!code) {
      return NextResponse.json({ valid: false, message: 'Please enter a coupon code.' }, { status: 400 });
    }

    const result = await Storage.validateCoupon(code, Number(subtotal) || 0);
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ valid: false, message: error.message || 'Coupon validation failed' }, { status: 500 });
  }
}
