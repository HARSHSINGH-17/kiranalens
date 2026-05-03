import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseClient } from '@/lib/supabase';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.SECRET_KEY || 'kiranalens-secret-key-2024';

function getUserIdFromRequest(req: NextRequest): string | null {
  const authHeader = req.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer ')) return null;
  try {
    const token = authHeader.slice(7);
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    return decoded.userId;
  } catch {
    return null;
  }
}

// GET /api/assessments - list assessments for authenticated user
export async function GET(req: NextRequest) {
  const userId = getUserIdFromRequest(req);
  if (!userId) {
    return NextResponse.json({ detail: 'Unauthorized' }, { status: 401 });
  }

  const supabase = getSupabaseClient();
  if (!supabase) {
    return NextResponse.json(
      { detail: 'Supabase is not configured' },
      { status: 500 }
    );
  }

  const { data, error } = await supabase
    .from('assessments')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Fetch assessments error:', error);
    return NextResponse.json({ detail: 'Failed to fetch assessments' }, { status: 500 });
  }

  return NextResponse.json({
    items: data || [],
    total: data?.length || 0,
    page: 1,
    limit: 100,
    pages: 1,
  });
}

// POST /api/assessments - create new assessment
export async function POST(req: NextRequest) {
  const userId = getUserIdFromRequest(req);
  if (!userId) {
    return NextResponse.json({ detail: 'Unauthorized' }, { status: 401 });
  }

  try {
    const supabase = getSupabaseClient();
    if (!supabase) {
      return NextResponse.json(
        { detail: 'Supabase is not configured' },
        { status: 500 }
      );
    }

    const body = await req.json();

    // Generate random AI scores for demo
    const csqs = Math.floor(Math.random() * 40) + 50;
    const tier = csqs >= 80 ? 'A' : csqs >= 65 ? 'B' : csqs >= 50 ? 'C' : 'D';
    const recommendation =
      csqs >= 75 ? 'pre_approve' : csqs >= 50 ? 'needs_verification' : 'reject';

    const assessmentData = {
      user_id: userId,
      store_name: body.store_name || body.storeName || 'New Store',
      address: body.address || `Location at ${body.lat}, ${body.lng}`,
      lat: body.lat ? String(body.lat) : '0',
      lng: body.lng ? String(body.lng) : '0',
      status: 'complete',
      csqs: String(csqs),
      store_tier: tier,
      confidence_score: String(Math.floor(Math.random() * 30) + 60),
      daily_sales_min: Math.floor(Math.random() * 20000) + 5000,
      daily_sales_max: Math.floor(Math.random() * 30000) + 25000,
      monthly_revenue_min: Math.floor(Math.random() * 500000) + 150000,
      monthly_revenue_max: Math.floor(Math.random() * 800000) + 700000,
      monthly_income_min: Math.floor(Math.random() * 50000) + 20000,
      monthly_income_max: Math.floor(Math.random() * 100000) + 100000,
      recommendation,
      risk_flags: [],
      image_urls: body.image_urls || body.imageUrls || [],
      signal_breakdown: {
        visual: {
          shelfDensityIndex: Math.floor(Math.random() * 40) + 50,
          skuDiversityScore: Math.floor(Math.random() * 40) + 50,
          inventoryValueBand: Math.floor(Math.random() * 40) + 50,
          refillSignal: Math.floor(Math.random() * 40) + 50,
          storeOrganizationScore: Math.floor(Math.random() * 40) + 50,
          counterActivityProxy: Math.floor(Math.random() * 40) + 50,
          exteriorQualityScore: Math.floor(Math.random() * 40) + 50,
        },
        geo: {
          roadTypeScore: Math.floor(Math.random() * 40) + 50,
          catchmentDensity: Math.floor(Math.random() * 40) + 50,
          footfallProxyIndex: Math.floor(Math.random() * 40) + 50,
          competitionDensity: Math.floor(Math.random() * 40) + 50,
          neighbourhoodQuality: Math.floor(Math.random() * 40) + 50,
        },
      },
    };

    const { data, error } = await supabase
      .from('assessments')
      .insert(assessmentData)
      .select()
      .single();

    if (error || !data) {
      console.error('Create assessment error:', error);
      return NextResponse.json({ detail: 'Failed to create assessment' }, { status: 500 });
    }

    return NextResponse.json(data, { status: 201 });
  } catch (err) {
    console.error('Create assessment error:', err);
    return NextResponse.json({ detail: 'Internal server error' }, { status: 500 });
  }
}
