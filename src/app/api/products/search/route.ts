import { NextRequest, NextResponse } from 'next/server';
import { Storage } from '@/lib/storage';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get('q') || '';

    if (!query.trim()) {
      return NextResponse.json({ results: [], categories: [] });
    }

    const { products } = await Storage.getProducts({ search: query, limit: 6 });
    const allCategories = await Storage.getCategories();

    const matchingCategories = allCategories.filter((c) =>
      c.name.toLowerCase().includes(query.toLowerCase())
    ).slice(0, 3);

    return NextResponse.json({
      results: products.map((p) => ({
        id: p._id,
        name: p.name,
        slug: p.slug,
        image: p.images[0],
        price: p.sellingPrice,
        mrp: p.mrp,
        brand: p.brand,
        category: p.category,
        stock: p.stock,
      })),
      categories: matchingCategories.map((c) => ({
        name: c.name,
        slug: c.slug,
      })),
    });
  } catch (error: any) {
    return NextResponse.json({ results: [], categories: [] });
  }
}
