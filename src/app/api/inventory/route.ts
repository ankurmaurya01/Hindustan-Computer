import { NextRequest, NextResponse } from 'next/server';
import { Storage } from '@/lib/storage';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const productId = searchParams.get('productId') || undefined;

    const logs = await Storage.getInventoryLogs(productId);
    const { products } = await Storage.getProducts({ limit: 1000 });

    const inventoryOverview = products.map((p) => ({
      id: p._id,
      name: p.name,
      sku: p.sku,
      category: p.category,
      stock: p.stock,
      lowStockThreshold: p.lowStockThreshold,
      purchasePrice: p.purchasePrice,
      sellingPrice: p.sellingPrice,
      inventoryValuation: p.stock * (p.purchasePrice || p.sellingPrice * 0.8),
      status: p.stock === 0 ? 'Out of Stock' : p.stock <= p.lowStockThreshold ? 'Low Stock' : 'In Stock',
    }));

    return NextResponse.json({ logs, inventory: inventoryOverview });
  } catch (error: any) {
    return NextResponse.json({ message: error.message || 'Failed to fetch inventory' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { productId, quantityChanged, changeType, reason, performedBy, supplierName } = body;

    if (!productId || quantityChanged === undefined || !changeType || !reason) {
      return NextResponse.json({ message: 'Missing required inventory adjustment parameters' }, { status: 400 });
    }

    const result = await Storage.adjustInventory(
      productId,
      Number(quantityChanged),
      changeType,
      reason,
      performedBy || 'Admin',
      supplierName
    );

    return NextResponse.json({ success: true, ...result });
  } catch (error: any) {
    return NextResponse.json({ message: error.message || 'Adjustment failed' }, { status: 500 });
  }
}
