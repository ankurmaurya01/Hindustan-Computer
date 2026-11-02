import { NextRequest, NextResponse } from 'next/server';
import { Storage } from '@/lib/storage';

export async function GET() {
  try {
    const banners = await Storage.getBanners();
    return NextResponse.json(banners);
  } catch (error: any) {
    return NextResponse.json({ message: error.message || 'Failed to fetch banners' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.title || !body.image) {
      return NextResponse.json({ message: 'Banner title and image URL are required' }, { status: 400 });
    }
    const banner = await Storage.createBanner(body);
    return NextResponse.json({ success: true, banner }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message || 'Failed to create banner' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ message: 'Banner ID is required' }, { status: 400 });
    }
    await Storage.deleteBanner(id);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ message: error.message || 'Failed to delete banner' }, { status: 500 });
  }
}
