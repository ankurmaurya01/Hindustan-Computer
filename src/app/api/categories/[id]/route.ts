import { NextRequest, NextResponse } from 'next/server';
import { Storage } from '@/lib/storage';

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await req.json();
    const updated = await Storage.updateCategory(params.id, body);
    if (!updated) {
      return NextResponse.json({ message: 'Category not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, category: updated });
  } catch (error: any) {
    return NextResponse.json({ message: error.message || 'Failed to update category' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const res = await Storage.deleteCategory(params.id);
    if (!res.success) {
      return NextResponse.json({ message: res.message }, { status: 400 });
    }
    return NextResponse.json({ success: true, message: 'Category deleted successfully' });
  } catch (error: any) {
    return NextResponse.json({ message: error.message || 'Failed to delete category' }, { status: 500 });
  }
}
