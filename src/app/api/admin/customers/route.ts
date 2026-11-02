import { NextRequest, NextResponse } from 'next/server';
import { Storage } from '@/lib/storage';

export async function GET() {
  try {
    const customers = await Storage.getCustomers();
    return NextResponse.json(customers);
  } catch (error: any) {
    return NextResponse.json({ message: error.message || 'Failed to fetch customers' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const { userId } = await req.json();
    if (!userId) {
      return NextResponse.json({ message: 'User ID is required' }, { status: 400 });
    }
    const updated = await Storage.toggleUserStatus(userId);
    return NextResponse.json({ success: true, user: updated });
  } catch (error: any) {
    return NextResponse.json({ message: error.message || 'Failed to toggle user status' }, { status: 500 });
  }
}
