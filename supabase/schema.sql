-- VvE Digitaal - Database Schema
-- Run this in Supabase SQL editor to set up the database

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- CORE TABLES
-- =====================================================

-- VvE's (Associations)
CREATE TABLE vves (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  address TEXT NOT NULL,
  city TEXT NOT NULL,
  postal_code TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('garage', 'storage', 'apartment', 'mixed')),
  total_units INTEGER NOT NULL DEFAULT 0,
  kvk_number TEXT,
  iban TEXT,
  monthly_contribution DECIMAL(10,2) DEFAULT 0,
  reserve_fund_balance DECIMAL(10,2) DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id)
);

-- Units (individual garage boxes / apartments)
CREATE TABLE units (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  vve_id UUID NOT NULL REFERENCES vves(id) ON DELETE CASCADE,
  unit_number TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('garage', 'storage', 'apartment', 'commercial')),
  breukdeel_numerator INTEGER NOT NULL DEFAULT 1,
  breukdeel_denominator INTEGER NOT NULL DEFAULT 1,
  floor_area_m2 DECIMAL(10,2),
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Members/Owners
CREATE TABLE members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id),
  vve_id UUID NOT NULL REFERENCES vves(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  role TEXT NOT NULL DEFAULT 'owner' CHECK (role IN ('owner', 'board_chair', 'board_secretary', 'board_treasurer', 'board_member')),
  unit_id UUID REFERENCES units(id),
  is_active BOOLEAN DEFAULT TRUE,
  joined_at TIMESTAMPTZ DEFAULT NOW()
);

-- Documents
CREATE TABLE documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  vve_id UUID NOT NULL REFERENCES vves(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('splitsingsakte', 'huishoudelijk_reglement', 'insurance', 'minutes', 'financial', 'jaarverslag', 'mjop', 'maintenance', 'other')),
  file_path TEXT NOT NULL,
  file_size INTEGER DEFAULT 0,
  mime_type TEXT,
  ai_summary TEXT,
  ai_extracted_data JSONB,
  uploaded_by UUID REFERENCES auth.users(id),
  uploaded_at TIMESTAMPTZ DEFAULT NOW()
);

-- Transactions
CREATE TABLE transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  vve_id UUID NOT NULL REFERENCES vves(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('contribution', 'expense', 'income', 'reserve_deposit')),
  amount DECIMAL(10,2) NOT NULL,
  description TEXT NOT NULL,
  category TEXT,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  member_id UUID REFERENCES members(id),
  ai_category TEXT,
  receipt_path TEXT,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Meetings
CREATE TABLE meetings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  vve_id UUID NOT NULL REFERENCES vves(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('alv', 'extraordinary', 'board')),
  date TIMESTAMPTZ NOT NULL,
  location TEXT,
  agenda JSONB DEFAULT '[]',
  minutes_text TEXT,
  ai_minutes TEXT,
  status TEXT NOT NULL DEFAULT 'planned' CHECK (status IN ('planned', 'in_progress', 'completed')),
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Votes
CREATE TABLE votes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  meeting_id UUID REFERENCES meetings(id),
  vve_id UUID NOT NULL REFERENCES vves(id) ON DELETE CASCADE,
  subject TEXT NOT NULL,
  description TEXT,
  type TEXT NOT NULL CHECK (type IN ('simple_majority', 'qualified_majority', 'unanimous')),
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'closed')),
  result TEXT CHECK (result IN ('approved', 'rejected', 'no_quorum')),
  deadline TIMESTAMPTZ,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Vote Responses
CREATE TABLE vote_responses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  vote_id UUID NOT NULL REFERENCES votes(id) ON DELETE CASCADE,
  member_id UUID NOT NULL REFERENCES members(id),
  response TEXT NOT NULL CHECK (response IN ('for', 'against', 'abstain')),
  proxy_for UUID REFERENCES members(id),
  voted_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(vote_id, member_id)
);

-- Maintenance Requests
CREATE TABLE maintenance_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  vve_id UUID NOT NULL REFERENCES vves(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  status TEXT NOT NULL DEFAULT 'reported' CHECK (status IN ('reported', 'assessed', 'approved', 'in_progress', 'completed')),
  reported_by UUID REFERENCES members(id),
  photos TEXT[] DEFAULT '{}',
  estimated_cost DECIMAL(10,2),
  actual_cost DECIMAL(10,2),
  ai_category TEXT,
  ai_priority_reason TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  resolved_at TIMESTAMPTZ
);

-- MJOP Items (Multi-year Maintenance Plan)
CREATE TABLE mjop_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  vve_id UUID NOT NULL REFERENCES vves(id) ON DELETE CASCADE,
  component TEXT NOT NULL,
  description TEXT NOT NULL,
  estimated_cost DECIMAL(10,2) NOT NULL,
  planned_year INTEGER NOT NULL,
  priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
  status TEXT NOT NULL DEFAULT 'planned' CHECK (status IN ('planned', 'in_progress', 'completed', 'deferred')),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Annual Reports
CREATE TABLE annual_reports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  vve_id UUID NOT NULL REFERENCES vves(id) ON DELETE CASCADE,
  year INTEGER NOT NULL,
  total_income DECIMAL(10,2) DEFAULT 0,
  total_expenses DECIMAL(10,2) DEFAULT 0,
  reserve_balance DECIMAL(10,2) DEFAULT 0,
  key_decisions JSONB DEFAULT '[]',
  maintenance_completed JSONB DEFAULT '[]',
  ai_summary TEXT,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'approved')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(vve_id, year)
);

-- Chat Messages (AI Assistant)
CREATE TABLE chat_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  vve_id UUID NOT NULL REFERENCES vves(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id),
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
  content TEXT NOT NULL,
  context JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Announcements
CREATE TABLE announcements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  vve_id UUID NOT NULL REFERENCES vves(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  author_id UUID REFERENCES members(id),
  author_name TEXT,
  is_pinned BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- INDEXES
-- =====================================================

CREATE INDEX idx_units_vve ON units(vve_id);
CREATE INDEX idx_members_vve ON members(vve_id);
CREATE INDEX idx_members_user ON members(user_id);
CREATE INDEX idx_documents_vve ON documents(vve_id);
CREATE INDEX idx_transactions_vve ON transactions(vve_id);
CREATE INDEX idx_transactions_date ON transactions(date);
CREATE INDEX idx_meetings_vve ON meetings(vve_id);
CREATE INDEX idx_votes_vve ON votes(vve_id);
CREATE INDEX idx_vote_responses_vote ON vote_responses(vote_id);
CREATE INDEX idx_maintenance_vve ON maintenance_requests(vve_id);
CREATE INDEX idx_mjop_vve ON mjop_items(vve_id);
CREATE INDEX idx_annual_reports_vve ON annual_reports(vve_id);
CREATE INDEX idx_chat_messages_vve ON chat_messages(vve_id);
CREATE INDEX idx_announcements_vve ON announcements(vve_id);

-- =====================================================
-- ROW LEVEL SECURITY (RLS)
-- =====================================================

ALTER TABLE vves ENABLE ROW LEVEL SECURITY;
ALTER TABLE units ENABLE ROW LEVEL SECURITY;
ALTER TABLE members ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE meetings ENABLE ROW LEVEL SECURITY;
ALTER TABLE votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE vote_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE maintenance_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE mjop_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE annual_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;

-- Users can see VvE's they are members of
CREATE POLICY "Members can view their VvE" ON vves
  FOR SELECT USING (
    id IN (SELECT vve_id FROM members WHERE user_id = auth.uid())
  );

-- Users can create VvE's
CREATE POLICY "Authenticated users can create VvE" ON vves
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- Members can view units in their VvE
CREATE POLICY "Members can view units" ON units
  FOR SELECT USING (
    vve_id IN (SELECT vve_id FROM members WHERE user_id = auth.uid())
  );

-- Members can view other members in their VvE
CREATE POLICY "Members can view members" ON members
  FOR SELECT USING (
    vve_id IN (SELECT vve_id FROM members WHERE user_id = auth.uid())
  );

-- Members can view documents in their VvE
CREATE POLICY "Members can view documents" ON documents
  FOR SELECT USING (
    vve_id IN (SELECT vve_id FROM members WHERE user_id = auth.uid())
  );

-- Board members can manage documents
CREATE POLICY "Board can manage documents" ON documents
  FOR ALL USING (
    vve_id IN (
      SELECT vve_id FROM members
      WHERE user_id = auth.uid()
      AND role IN ('board_chair', 'board_secretary', 'board_treasurer', 'board_member')
    )
  );

-- Members can view transactions
CREATE POLICY "Members can view transactions" ON transactions
  FOR SELECT USING (
    vve_id IN (SELECT vve_id FROM members WHERE user_id = auth.uid())
  );

-- Members can view meetings
CREATE POLICY "Members can view meetings" ON meetings
  FOR SELECT USING (
    vve_id IN (SELECT vve_id FROM members WHERE user_id = auth.uid())
  );

-- Members can view and cast votes
CREATE POLICY "Members can view votes" ON votes
  FOR SELECT USING (
    vve_id IN (SELECT vve_id FROM members WHERE user_id = auth.uid())
  );

CREATE POLICY "Members can cast votes" ON vote_responses
  FOR INSERT WITH CHECK (
    vote_id IN (
      SELECT v.id FROM votes v
      JOIN members m ON m.vve_id = v.vve_id
      WHERE m.user_id = auth.uid()
    )
  );

-- Members can view and create maintenance requests
CREATE POLICY "Members can view maintenance" ON maintenance_requests
  FOR SELECT USING (
    vve_id IN (SELECT vve_id FROM members WHERE user_id = auth.uid())
  );

CREATE POLICY "Members can create maintenance" ON maintenance_requests
  FOR INSERT WITH CHECK (
    vve_id IN (SELECT vve_id FROM members WHERE user_id = auth.uid())
  );

-- Members can view MJOP
CREATE POLICY "Members can view MJOP" ON mjop_items
  FOR SELECT USING (
    vve_id IN (SELECT vve_id FROM members WHERE user_id = auth.uid())
  );

-- Members can view annual reports
CREATE POLICY "Members can view annual reports" ON annual_reports
  FOR SELECT USING (
    vve_id IN (SELECT vve_id FROM members WHERE user_id = auth.uid())
  );

-- Members can use AI chat
CREATE POLICY "Members can use chat" ON chat_messages
  FOR ALL USING (
    vve_id IN (SELECT vve_id FROM members WHERE user_id = auth.uid())
  );

-- Members can view announcements
CREATE POLICY "Members can view announcements" ON announcements
  FOR SELECT USING (
    vve_id IN (SELECT vve_id FROM members WHERE user_id = auth.uid())
  );
