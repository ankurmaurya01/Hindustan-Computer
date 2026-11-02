import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const JWT_SECRET = process.env.JWT_SECRET || 'hindustan_computer_super_secure_jwt_secret_key_2026_production';

export interface TokenPayload {
  userId: string;
  name: string;
  email: string;
  role: 'customer' | 'superadmin' | 'admin' | 'product_manager' | 'order_manager' | 'inventory_manager' | 'support';
}

export function signToken(payload: TokenPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

export function verifyToken(token: string): TokenPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as TokenPayload;
  } catch {
    return null;
  }
}

export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export const ADMIN_ROLES = [
  'superadmin',
  'admin',
  'product_manager',
  'order_manager',
  'inventory_manager',
  'support',
] as const;

export function isAdminRole(role: string): boolean {
  return ADMIN_ROLES.includes(role as any);
}
