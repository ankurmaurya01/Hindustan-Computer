import { NextRequest, NextResponse } from 'next/server';
import { Storage } from '@/lib/storage';
import { comparePassword, signToken } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const { email, password, adminOnly } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ message: 'Username and password are required' }, { status: 400 });
    }

    // Allow "admin" as a shortcut username for the superadmin account
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@hindustancomputer.com';
    const resolvedEmail = email.trim().toLowerCase() === 'admin' ? adminEmail : email.trim();

    const user = await Storage.getUserByEmail(resolvedEmail);
    if (!user) {
      return NextResponse.json({ message: 'Invalid username or password' }, { status: 401 });
    }

    if (!user.isActive) {
      return NextResponse.json({ message: 'This account has been disabled. Please contact support.' }, { status: 403 });
    }

    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
      return NextResponse.json({ message: 'Invalid username or password' }, { status: 401 });
    }

    if (adminOnly && user.role === 'customer') {
      return NextResponse.json({ message: 'Access denied. Administrator privileges required.' }, { status: 403 });
    }

    const token = signToken({
      userId: String(user._id),
      name: user.name,
      email: user.email,
      role: user.role,
    });

    const response = NextResponse.json({
      success: true,
      token,
      user: {
        id: String(user._id),
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
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
    return NextResponse.json({ message: error.message || 'Login failed' }, { status: 500 });
  }
}
