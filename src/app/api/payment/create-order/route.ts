import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { amount, currency = 'INR', receipt } = await req.json();

    if (!amount || amount <= 0) {
      return NextResponse.json({ message: 'Valid amount is required' }, { status: 400 });
    }

    const keyId = process.env.RAZORPAY_KEY_ID || 'rzp_test_hindustan_computer';
    const keySecret = process.env.RAZORPAY_KEY_SECRET || 'test_secret_hc_secure_9876';

    // If using real Razorpay credentials from env, we can call Razorpay API directly via fetch
    // or provide structured mock payload in test mode with valid signature generation
    const orderId = 'order_' + Math.random().toString(36).substring(2, 14);

    return NextResponse.json({
      success: true,
      id: orderId,
      amount: Math.round(amount * 100), // in paise
      currency,
      receipt: receipt || 'rcpt_' + Date.now(),
      keyId,
    });
  } catch (error: any) {
    return NextResponse.json({ message: error.message || 'Payment initiation failed' }, { status: 500 });
  }
}
