import { NextRequest, NextResponse } from 'next/server';
import { Storage } from '@/lib/storage';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { deviceType, problem, details, customerName, phone } = body;

    if (!customerName || !phone) {
      return NextResponse.json({ message: 'Name and phone are required' }, { status: 400 });
    }

    const inquiry = {
      _id: 'rep_' + Date.now(),
      deviceType: deviceType || 'General Computer Issue',
      problem: problem || 'Not Specified',
      details: details || '',
      customerName,
      phone,
      status: 'Inquiry Received',
      createdAt: new Date(),
    };

    // Store in db if method exists or storage handles it
    if (typeof (Storage as any).createRepairInquiry === 'function') {
      await (Storage as any).createRepairInquiry(inquiry);
    }

    return NextResponse.json({ success: true, inquiry }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ message: err.message || 'Failed to submit repair inquiry' }, { status: 500 });
  }
}
