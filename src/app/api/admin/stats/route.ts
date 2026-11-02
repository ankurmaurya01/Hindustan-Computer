import { NextResponse } from 'next/server';
import { Storage } from '@/lib/storage';

export async function GET() {
  try {
    const stats = await Storage.getDashboardStats();
    return NextResponse.json(stats);
  } catch (error: any) {
    return NextResponse.json({ message: error.message || 'Failed to fetch dashboard stats' }, { status: 500 });
  }
}
