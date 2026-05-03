import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseClient } from '@/lib/supabase';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.SECRET_KEY || 'kiranalens-secret-key-2024';

export async function POST(req: NextRequest) {
  try {
    const { email, password, name, organisation } = await req.json();

    if (!email || !password || !name) {
      return NextResponse.json(
        { detail: 'Name, email and password are required' },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { detail: 'Password must be at least 8 characters' },
        { status: 400 }
      );
    }

    const supabase = getSupabaseClient();
    if (!supabase) {
      return NextResponse.json(
        { detail: 'Supabase is not configured' },
        { status: 500 }
      );
    }

    // Check if user already exists
    const { data: existingUser } = await supabase
      .from('users')
      .select('id')
      .eq('email', email.toLowerCase())
      .single();

    if (existingUser) {
      return NextResponse.json(
        { detail: 'An account with this email already exists' },
        { status: 409 }
      );
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 12);

    // Insert user
    const { data: newUser, error } = await supabase
      .from('users')
      .insert({
        email: email.toLowerCase(),
        name,
        organisation: organisation || null,
        password_hash: passwordHash,
        role: 'credit_officer',
      })
      .select()
      .single();

    if (error || !newUser) {
      console.error('User creation error:', error);
      return NextResponse.json({ detail: 'Failed to create account' }, { status: 500 });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: newUser.id, email: newUser.email, role: newUser.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    return NextResponse.json({
      access_token: token,
      refresh_token: token,
      token_type: 'bearer',
      user: {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
        role: newUser.role,
        organisation: newUser.organisation,
        created_at: newUser.created_at,
      },
    });
  } catch (err) {
    console.error('Register error:', err);
    return NextResponse.json({ detail: 'Internal server error' }, { status: 500 });
  }
}
