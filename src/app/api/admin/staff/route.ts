import { NextRequest, NextResponse } from 'next/server';
import { Storage } from '@/lib/storage';

export async function GET() {
  try {
    const staff = await Storage.getStaff();
    return NextResponse.json(staff);
  } catch (error: any) {
    return NextResponse.json({ message: error.message || 'Failed to fetch staff' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { name, email, password, phone, role } = await req.json();

    if (!name || !email || !password || !role) {
      return NextResponse.json({ message: 'Name, email, password, and role are required' }, { status: 400 });
    }

    const validRoles = ['admin', 'product_manager', 'order_manager', 'inventory_manager', 'support'];
    if (!validRoles.includes(role)) {
      return NextResponse.json({ message: 'Invalid staff role specified' }, { status: 400 });
    }

    const newUser = await Storage.createUser({
      name,
      email,
      password,
      phone: phone || '',
      role,
    });

    const { password: _, ...cleanUser } = newUser;
    return NextResponse.json({ success: true, user: cleanUser }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message || 'Failed to add staff member' }, { status: 400 });
  }
}
