-- VvE Digitaal - Complete Database Schema
-- Run this in your Supabase SQL Editor after creating a new project

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- CORE TABLES
-- ============================================

CREATE TABLE vves (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  address TEXT NOT NULL,
  city TEXT NOT NULL,
  postal_code TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'garage' CHECK (type IN ('garage', 'storage', 'apartment', 'mixed')),
  total_units INT NOT NULL DEFAULT 0,
  kvk_number TEXT,
  iban TEXT,
  iban_name TEXT,
  default_contribution DECIMAL(10,2) DEFAULT 50.00,
  payment_term_days INT DEFAULT 30,
  email_from TEXT,
  email_reply_to TEXT,
  invoice_footer TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id)
);

CREATE TABLE units (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  vve_id UUID NOT NULL REFERENCES vves(id) ON DELETE CASCADE,
  unit_number TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'garage' CHECK (type IN ('garage', 'storage', 'apartment', 'commercial')),
  breukdeel_numerator INT NOT NULL DEFAULT 1,
  breukdeel_denominator INT NOT NULL DEFAULT 1,
  floor_area_m2 DECIMAL(8,2),
  description TEXT,
  UNIQUE(vve_id, unit_number)
);

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

CREATE INDEX idx_members_vve ON members(vve_id);
CREATE INDEX idx_members_user ON members(user_id);
CREATE INDEX idx_members_email ON members(email);

-- ============================================
-- FINANCIAL TABLES
-- ============================================

CREATE TABLE invoices (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  invoice_number TEXT NOT NULL UNIQUE,
  vve_id UUID NOT NULL REFERENCES vves(id) ON DELETE CASCADE,
  member_id UUID NOT NULL REFERENCES members(id),
  items JSONB NOT NULL DEFAULT '[]',
  subtotal DECIMAL(10,2) NOT NULL DEFAULT 0,
  total DECIMAL(10,2) NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'sent', 'open', 'paid', 'overdue', 'cancelled')),
  period TEXT NOT NULL,
  issue_date DATE NOT NULL DEFAULT CURRENT_DATE,
  due_date DATE NOT NULL,
  paid_date DATE,
  sent_date DATE,
  payment_reference TEXT,
  mollie_payment_id TEXT,
  notes TEXT,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_invoices_vve ON invoices(vve_id);
CREATE INDEX idx_invoices_member ON invoices(member_id);
CREATE INDEX idx_invoices_status ON invoices(status);
CREATE INDEX idx_invoices_due_date ON invoices(due_date);
CREATE INDEX idx_invoices_mollie ON invoices(mollie_payment_id);

CREATE TABLE transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  vve_id UUID NOT NULL REFERENCES vves(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('contribution', 'expense', 'income', 'reserve_deposit')),
  amount DECIMAL(10,2) NOT NULL,
  description TEXT NOT NULL,
  category TEXT,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  member_id UUID REFERENCES members(id),
  invoice_id UUID REFERENCES invoices(id),
  ai_category TEXT,
  receipt_path TEXT,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_transactions_vve ON transactions(vve_id);
CREATE INDEX idx_transactions_date ON transactions(date);

-- Sequential invoice numbering per VvE per year
CREATE TABLE invoice_counters (
  vve_id UUID NOT NULL REFERENCES vves(id) ON DELETE CASCADE,
  year INT NOT NULL,
  last_number INT NOT NULL DEFAULT 0,
  PRIMARY KEY (vve_id, year)
);

-- ============================================
-- DOCUMENT TABLES
-- ============================================

CREATE TABLE documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  vve_id UUID NOT NULL REFERENCES vves(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('splitsingsakte', 'huishoudelijk_reglement', 'insurance', 'minutes', 'financial', 'jaarverslag', 'mjop', 'maintenance', 'other')),
  file_path TEXT NOT NULL,
  file_size INT,
  mime_type TEXT,
  ai_summary TEXT,
  ai_extracted_data JSONB,
  uploaded_by UUID REFERENCES auth.users(id),
  uploaded_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_documents_vve ON documents(vve_id);

-- ============================================
-- MEETING & VOTING TABLES
-- ============================================

CREATE TABLE meetings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  vve_id UUID NOT NULL REFERENCES vves(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'alv' CHECK (type IN ('alv', 'extraordinary', 'board')),
  date TIMESTAMPTZ NOT NULL,
  location TEXT,
  agenda JSONB DEFAULT '[]',
  minutes_text TEXT,
  ai_minutes TEXT,
  status TEXT NOT NULL DEFAULT 'planned' CHECK (status IN ('planned', 'in_progress', 'completed')),
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_meetings_vve ON meetings(vve_id);

CREATE TABLE votes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  meeting_id UUID REFERENCES meetings(id),
  vve_id UUID NOT NULL REFERENCES vves(id) ON DELETE CASCADE,
  subject TEXT NOT NULL,
  description TEXT,
  type TEXT NOT NULL DEFAULT 'simple_majority' CHECK (type IN ('simple_majority', 'qualified_majority', 'unanimous')),
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'closed')),
  result TEXT CHECK (result IN ('approved', 'rejected', 'no_quorum')),
  deadline TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_votes_vve ON votes(vve_id);

CREATE TABLE vote_responses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  vote_id UUID NOT NULL REFERENCES votes(id) ON DELETE CASCADE,
  member_id UUID NOT NULL REFERENCES members(id),
  response TEXT NOT NULL CHECK (response IN ('for', 'against', 'abstain')),
  proxy_for UUID REFERENCES members(id),
  voted_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(vote_id, member_id)
);

-- ============================================
-- MAINTENANCE TABLES
-- ============================================

CREATE TABLE maintenance_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  vve_id UUID NOT NULL REFERENCES vves(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
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

CREATE INDEX idx_maintenance_vve ON maintenance_requests(vve_id);

CREATE TABLE mjop_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  vve_id UUID NOT NULL REFERENCES vves(id) ON DELETE CASCADE,
  component TEXT NOT NULL,
  description TEXT,
  estimated_cost DECIMAL(10,2) NOT NULL DEFAULT 0,
  planned_year INT NOT NULL,
  priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
  status TEXT NOT NULL DEFAULT 'planned' CHECK (status IN ('planned', 'in_progress', 'completed', 'deferred')),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_mjop_vve ON mjop_items(vve_id);

-- ============================================
-- COMMUNICATION TABLES
-- ============================================

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

CREATE INDEX idx_announcements_vve ON announcements(vve_id);

CREATE TABLE chat_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  vve_id UUID NOT NULL REFERENCES vves(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id),
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
  content TEXT NOT NULL,
  context JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_chat_vve ON chat_messages(vve_id);

-- ============================================
-- ANNUAL REPORTS
-- ============================================

CREATE TABLE annual_reports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  vve_id UUID NOT NULL REFERENCES vves(id) ON DELETE CASCADE,
  year INT NOT NULL,
  total_income DECIMAL(10,2) DEFAULT 0,
  total_expenses DECIMAL(10,2) DEFAULT 0,
  reserve_balance DECIMAL(10,2) DEFAULT 0,
  key_decisions TEXT[] DEFAULT '{}',
  maintenance_completed TEXT[] DEFAULT '{}',
  ai_summary TEXT,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'approved')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(vve_id, year)
);

-- ============================================
-- NOTIFICATION SETTINGS
-- ============================================

CREATE TABLE notification_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  vve_id UUID NOT NULL REFERENCES vves(id) ON DELETE CASCADE,
  notify_invoice BOOLEAN DEFAULT TRUE,
  notify_overdue BOOLEAN DEFAULT TRUE,
  auto_overdue_days INT DEFAULT 7,
  notify_meeting BOOLEAN DEFAULT TRUE,
  notify_vote BOOLEAN DEFAULT TRUE,
  notify_maintenance BOOLEAN DEFAULT TRUE,
  UNIQUE(vve_id)
);

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================

ALTER TABLE vves ENABLE ROW LEVEL SECURITY;
ALTER TABLE units ENABLE ROW LEVEL SECURITY;
ALTER TABLE members ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoice_counters ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE meetings ENABLE ROW LEVEL SECURITY;
ALTER TABLE votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE vote_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE maintenance_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE mjop_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE annual_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE notification_settings ENABLE ROW LEVEL SECURITY;

-- Helper: get VvE IDs for current user
CREATE OR REPLACE FUNCTION user_vve_ids()
RETURNS SETOF UUID AS $$
  SELECT vve_id FROM members WHERE user_id = auth.uid() AND is_active = TRUE;
$$ LANGUAGE SQL SECURITY DEFINER STABLE;

-- Helper: check if user is board member
CREATE OR REPLACE FUNCTION is_board_member(target_vve_id UUID)
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM members
    WHERE user_id = auth.uid()
    AND vve_id = target_vve_id
    AND is_active = TRUE
    AND role IN ('board_chair', 'board_secretary', 'board_treasurer', 'board_member')
  );
$$ LANGUAGE SQL SECURITY DEFINER STABLE;

-- VvEs
CREATE POLICY "Members can view their VvEs" ON vves FOR SELECT USING (id IN (SELECT user_vve_ids()));
CREATE POLICY "Users can create VvE" ON vves FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Board can update VvE" ON vves FOR UPDATE USING (is_board_member(id));

-- Units
CREATE POLICY "Members can view units" ON units FOR SELECT USING (vve_id IN (SELECT user_vve_ids()));
CREATE POLICY "Board can manage units" ON units FOR ALL USING (is_board_member(vve_id));

-- Members
CREATE POLICY "Members can view co-members" ON members FOR SELECT USING (vve_id IN (SELECT user_vve_ids()));
CREATE POLICY "Board can manage members" ON members FOR ALL USING (is_board_member(vve_id));

-- Invoices
CREATE POLICY "Members see own invoices" ON invoices FOR SELECT USING (
  vve_id IN (SELECT user_vve_ids()) AND (
    is_board_member(vve_id) OR member_id IN (SELECT id FROM members WHERE user_id = auth.uid())
  )
);
CREATE POLICY "Board can manage invoices" ON invoices FOR ALL USING (is_board_member(vve_id));

-- Transactions
CREATE POLICY "Members can view transactions" ON transactions FOR SELECT USING (vve_id IN (SELECT user_vve_ids()));
CREATE POLICY "Board can manage transactions" ON transactions FOR ALL USING (is_board_member(vve_id));

-- Invoice counters
CREATE POLICY "Board can manage counters" ON invoice_counters FOR ALL USING (is_board_member(vve_id));

-- Documents
CREATE POLICY "Members can view documents" ON documents FOR SELECT USING (vve_id IN (SELECT user_vve_ids()));
CREATE POLICY "Board can manage documents" ON documents FOR ALL USING (is_board_member(vve_id));

-- Meetings
CREATE POLICY "Members can view meetings" ON meetings FOR SELECT USING (vve_id IN (SELECT user_vve_ids()));
CREATE POLICY "Board can manage meetings" ON meetings FOR ALL USING (is_board_member(vve_id));

-- Votes
CREATE POLICY "Members can view votes" ON votes FOR SELECT USING (vve_id IN (SELECT user_vve_ids()));
CREATE POLICY "Board can manage votes" ON votes FOR ALL USING (is_board_member(vve_id));

-- Vote responses
CREATE POLICY "Members can vote" ON vote_responses FOR INSERT WITH CHECK (
  vote_id IN (SELECT id FROM votes WHERE vve_id IN (SELECT user_vve_ids()))
);
CREATE POLICY "Members can view votes" ON vote_responses FOR SELECT USING (
  vote_id IN (SELECT id FROM votes WHERE vve_id IN (SELECT user_vve_ids()))
);

-- Maintenance
CREATE POLICY "Members can view maintenance" ON maintenance_requests FOR SELECT USING (vve_id IN (SELECT user_vve_ids()));
CREATE POLICY "Members can create maintenance" ON maintenance_requests FOR INSERT WITH CHECK (vve_id IN (SELECT user_vve_ids()));
CREATE POLICY "Board can manage maintenance" ON maintenance_requests FOR UPDATE USING (is_board_member(vve_id));

-- MJOP
CREATE POLICY "Members can view MJOP" ON mjop_items FOR SELECT USING (vve_id IN (SELECT user_vve_ids()));
CREATE POLICY "Board can manage MJOP" ON mjop_items FOR ALL USING (is_board_member(vve_id));

-- Announcements
CREATE POLICY "Members can view announcements" ON announcements FOR SELECT USING (vve_id IN (SELECT user_vve_ids()));
CREATE POLICY "Board can manage announcements" ON announcements FOR ALL USING (is_board_member(vve_id));

-- Chat
CREATE POLICY "Users own chat" ON chat_messages FOR ALL USING (user_id = auth.uid() AND vve_id IN (SELECT user_vve_ids()));

-- Annual reports
CREATE POLICY "Members can view reports" ON annual_reports FOR SELECT USING (vve_id IN (SELECT user_vve_ids()));
CREATE POLICY "Board can manage reports" ON annual_reports FOR ALL USING (is_board_member(vve_id));

-- Notification settings
CREATE POLICY "Board can manage notifications" ON notification_settings FOR ALL USING (is_board_member(vve_id));

-- ============================================
-- FUNCTIONS
-- ============================================

-- Auto-increment invoice number
CREATE OR REPLACE FUNCTION next_invoice_number(target_vve_id UUID, target_year INT)
RETURNS TEXT AS $$
DECLARE
  next_num INT;
  vve_prefix TEXT;
BEGIN
  INSERT INTO invoice_counters (vve_id, year, last_number)
  VALUES (target_vve_id, target_year, 1)
  ON CONFLICT (vve_id, year)
  DO UPDATE SET last_number = invoice_counters.last_number + 1
  RETURNING last_number INTO next_num;

  SELECT UPPER(SUBSTRING(name FROM 1 FOR 3)) INTO vve_prefix FROM vves WHERE id = target_vve_id;
  RETURN vve_prefix || '-' || target_year || '-' || LPAD(next_num::TEXT, 4, '0');
END;
$$ LANGUAGE plpgsql;

-- Mark overdue invoices (call via cron or edge function)
CREATE OR REPLACE FUNCTION mark_overdue_invoices()
RETURNS INT AS $$
DECLARE
  updated INT;
BEGIN
  UPDATE invoices SET status = 'overdue'
  WHERE status IN ('sent', 'open') AND due_date < CURRENT_DATE;
  GET DIAGNOSTICS updated = ROW_COUNT;
  RETURN updated;
END;
$$ LANGUAGE plpgsql;
