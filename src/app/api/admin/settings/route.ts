import { NextRequest, NextResponse } from 'next/server';
import { Storage } from '@/lib/storage';

export async function GET() {
  try {
    const settings = await Storage.getSettings();
    return NextResponse.json(settings);
  } catch (error: any) {
    return NextResponse.json({ message: error.message || 'Failed to fetch settings' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const updated = await Storage.updateSettings(body);
    return NextResponse.json({ success: true, settings: updated });
  } catch (error: any) {
    return NextResponse.json({ message: error.message || 'Failed to update settings' }, { status: 500 });
  }
}
