import { NextRequest, NextResponse } from 'next/server';
import { Storage } from '@/lib/storage';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category') || undefined;
    const brand = searchParams.get('brand') || undefined;
    const search = searchParams.get('search') || undefined;
    const minPrice = searchParams.get('minPrice') ? Number(searchParams.get('minPrice')) : undefined;
    const maxPrice = searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : undefined;
    const inStockOnly = searchParams.get('inStockOnly') === 'true';
    const featured = searchParams.get('featured') === 'true';
    const bestseller = searchParams.get('bestseller') === 'true';
    const newArrival = searchParams.get('newArrival') === 'true';
    const sort = searchParams.get('sort') || 'newest';
    const page = searchParams.get('page') ? Number(searchParams.get('page')) : 1;
    const limit = searchParams.get('limit') ? Number(searchParams.get('limit')) : 24;

    const result = await Storage.getProducts({
      category,
      brand,
      search,
      minPrice,
      maxPrice,
      inStockOnly,
      featured,
      bestseller,
      newArrival,
      sort,
      page,
      limit,
    });

    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ message: error.message || 'Failed to fetch products' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (!body.name || !body.sellingPrice) {
      return NextResponse.json({ message: 'Product name and selling price are required' }, { status: 400 });
    }

    const newProduct = await Storage.createProduct(body);
    return NextResponse.json({ success: true, product: newProduct }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message || 'Failed to create product' }, { status: 500 });
  }
}
