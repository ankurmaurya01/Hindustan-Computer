import { NextRequest, NextResponse } from 'next/server';
import { Storage } from '@/lib/storage';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const productId = searchParams.get('productId') || undefined;
    const reviews = await Storage.getReviews(productId);
    return NextResponse.json(reviews);
  } catch (error: any) {
    return NextResponse.json({ message: error.message || 'Failed to fetch reviews' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.productId || !body.customerName || !body.rating || !body.title || !body.comment) {
      return NextResponse.json({ message: 'All review fields are required' }, { status: 400 });
    }
    const review = await Storage.createReview(body);
    return NextResponse.json({ success: true, review }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message || 'Failed to submit review' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, status, adminReply } = body;
    if (!id || !status) {
      return NextResponse.json({ message: 'Review ID and status are required' }, { status: 400 });
    }
    const updated = await Storage.updateReviewStatus(id, status, adminReply);
    return NextResponse.json({ success: true, review: updated });
  } catch (error: any) {
    return NextResponse.json({ message: error.message || 'Failed to update review' }, { status: 500 });
  }
}
