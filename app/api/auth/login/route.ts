import { NextRequest, NextResponse } from 'next/server';

// Mock user database - In production, use a real database
const users = [
  {
    id: '1',
    email: 'admin@example.com',
    password: 'admin123', // In production, use hashed passwords
    name: 'Admin User',
  },
  {
    id: '2',
    email: 'user@example.com',
    password: 'user123',
    name: 'Test User',
  },
];

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { message: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Find user
    const user = users.find(
      (u) => u.email === email && u.password === password
    );

    if (!user) {
      return NextResponse.json(
        { message: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Generate a simple token (In production, use JWT or similar)
    const token = Buffer.from(`${user.id}:${user.email}`).toString('base64');

    // Return user data (without password)
    const { password: _, ...userWithoutPassword } = user;

    return NextResponse.json({
      message: 'Login successful',
      user: userWithoutPassword,
      token,
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
