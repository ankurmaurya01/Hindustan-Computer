import { NextRequest, NextResponse } from 'next/server';
import { Storage } from '@/lib/storage';

export async function GET() {
  try {
    const categories = await Storage.getCategories();
    return NextResponse.json(categories);
  } catch (error: any) {
    return NextResponse.json({ message: error.message || 'Failed to fetch categories' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.name) {
      return NextResponse.json({ message: 'Category name is required' }, { status: 400 });
    }
    const newCategory = await Storage.createCategory(body);
    return NextResponse.json({ success: true, category: newCategory }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message || 'Failed to create category' }, { status: 500 });
  }
}
