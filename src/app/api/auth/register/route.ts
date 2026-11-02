import { NextRequest, NextResponse } from 'next/server';
import { Storage } from '@/lib/storage';
import { signToken } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const { name, email, password, phone } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json({ message: 'Name, email, and password are required' }, { status: 400 });
    }

    if (password.length < 6) {
      return NextResponse.json({ message: 'Password must be at least 6 characters' }, { status: 400 });
    }

    // Security check: Customer registration NEVER allows escalating role to admin
    const newUser = await Storage.createUser({
      name,
      email,
      password,
      phone: phone || '',
      role: 'customer', // strictly customer
    });

    const token = signToken({
      userId: String(newUser._id),
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
    });

    const response = NextResponse.json({
      success: true,
      token,
      user: {
        id: String(newUser._id),
        name: newUser.name,
        email: newUser.email,
        phone: newUser.phone,
        role: newUser.role,
      },
    });

    response.cookies.set('hc_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60,
    });

    return response;
  } catch (error: any) {
    return NextResponse.json({ message: error.message || 'Registration failed' }, { status: 400 });
  }
}
