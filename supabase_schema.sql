-- KiranaLens Database Schema for Supabase
-- Run this in your Supabase SQL Editor: https://app.supabase.com/project/sjwaszpdqyklqqlgzpja/sql

-- ============================================================
-- USERS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS public.users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  organisation TEXT,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'credit_officer' CHECK (role IN ('admin', 'credit_officer', 'branch_manager')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Disable RLS so Next.js API routes using anon key can read/write
ALTER TABLE public.users DISABLE ROW LEVEL SECURITY;

-- ============================================================
-- ASSESSMENTS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS public.assessments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  store_name TEXT,
  address TEXT,
  lat TEXT,
  lng TEXT,
  gps_accuracy_metres NUMERIC,
  monthly_rent NUMERIC,
  years_in_operation NUMERIC,
  shop_size NUMERIC,
  image_urls TEXT[] DEFAULT '{}',
  status TEXT NOT NULL DEFAULT 'complete' CHECK (status IN ('pending', 'processing', 'complete', 'error')),
  error_message TEXT,
  csqs TEXT,
  store_tier TEXT CHECK (store_tier IN ('A', 'B', 'C', 'D', 'E')),
  confidence_score TEXT,
  daily_sales_min NUMERIC,
  daily_sales_max NUMERIC,
  monthly_revenue_min NUMERIC,
  monthly_revenue_max NUMERIC,
  monthly_income_min NUMERIC,
  monthly_income_max NUMERIC,
  risk_flags JSONB DEFAULT '[]',
  recommendation TEXT CHECK (recommendation IN ('pre_approve', 'proceed_with_caution', 'needs_verification', 'reject')),
  signal_breakdown JSONB,
  pdf_report_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Disable RLS so Next.js API routes using anon key can read/write
ALTER TABLE public.assessments DISABLE ROW LEVEL SECURITY;

-- ============================================================
-- SEED DEMO USER (password: Demo@1234)
-- ============================================================
INSERT INTO public.users (email, name, organisation, password_hash, role)
VALUES (
  'demo@kiranalens.com',
  'Demo User',
  'KiranaLens Demo',
  '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LeKB./Jmf0T/FiZBO',
  'credit_officer'
)
ON CONFLICT (email) DO NOTHING;
