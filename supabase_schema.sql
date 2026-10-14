-- ============================================================================
-- SMRU HOSTEL CARE — PRODUCTION POSTGRESQL / SUPABASE DATABASE SCHEMA
-- Features: UUID Primary Keys, Relational Constraints, Auto Reference Sequence,
-- Row-Level Security (RLS) Policies, Triggers, and Initial Seeds.
-- ============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. PROFILES TABLE (Mirrors Supabase Auth Users)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    college_email VARCHAR(255) UNIQUE NOT NULL,
    role VARCHAR(50) NOT NULL CHECK (role IN ('student', 'staff', 'warden', 'admin')),
    hostel_block VARCHAR(100),
    room_number VARCHAR(50),
    account_status VARCHAR(50) DEFAULT 'active' CHECK (account_status IN ('active', 'deactivated', 'suspended')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. DEPARTMENTS TABLE
CREATE TABLE IF NOT EXISTS public.departments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. DEPARTMENT MEMBERS (Staff-to-Department mapping)
CREATE TABLE IF NOT EXISTS public.department_members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    department_id UUID REFERENCES public.departments(id) ON DELETE CASCADE,
    role_title VARCHAR(100) DEFAULT 'Staff Member',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, department_id)
);

-- 4. SEQUENCE FOR UNIQUE COMPLAINT REFERENCE (e.g. HC-2026-00001)
CREATE SEQUENCE IF NOT EXISTS complaint_ref_seq START WITH 1;

CREATE OR REPLACE FUNCTION generate_complaint_ref_no()
RETURNS TRIGGER AS $$
BEGIN
    NEW.reference_number := 'HC-' || TO_CHAR(CURRENT_DATE, 'YYYY') || '-' || LPAD(NEXTVAL('complaint_ref_seq')::TEXT, 5, '0');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 5. COMPLAINTS TABLE
CREATE TABLE IF NOT EXISTS public.complaints (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    reference_number VARCHAR(50) UNIQUE,
    student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE RESTRICT,
    category VARCHAR(100) NOT NULL,
    subcategory VARCHAR(150) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    block VARCHAR(100) NOT NULL,
    room VARCHAR(50) NOT NULL,
    urgency VARCHAR(30) NOT NULL CHECK (urgency IN ('Normal', 'High', 'Critical')),
    status VARCHAR(50) DEFAULT 'Submitted' CHECK (status IN ('Submitted', 'Acknowledged', 'In Progress', 'Waiting for Student', 'Resolved', 'Closed', 'Escalated')),
    assigned_department VARCHAR(100) NOT NULL,
    assigned_official_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    contact_preference VARCHAR(100) DEFAULT 'In-Person at Room',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TRIGGER trigger_set_complaint_ref
BEFORE INSERT ON public.complaints
FOR EACH ROW
EXECUTE FUNCTION generate_complaint_ref_no();

-- 6. COMPLAINT ATTACHMENTS (Secure photo evidence)
CREATE TABLE IF NOT EXISTS public.complaint_attachments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    complaint_id UUID NOT NULL REFERENCES public.complaints(id) ON DELETE CASCADE,
    file_path TEXT NOT NULL,
    file_type VARCHAR(50),
    uploader_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. COMPLAINT COMMENTS & COMMUNICATION
CREATE TABLE IF NOT EXISTS public.complaint_comments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    complaint_id UUID NOT NULL REFERENCES public.complaints(id) ON DELETE CASCADE,
    author_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    message TEXT NOT NULL,
    visibility VARCHAR(30) DEFAULT 'public' CHECK (visibility IN ('public', 'internal')), -- 'internal' is visible only to officials
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 8. COMPLAINT STATUS AUDIT HISTORY
CREATE TABLE IF NOT EXISTS public.complaint_status_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    complaint_id UUID NOT NULL REFERENCES public.complaints(id) ON DELETE CASCADE,
    previous_status VARCHAR(50),
    new_status VARCHAR(50) NOT NULL,
    changed_by UUID NOT NULL REFERENCES public.profiles(id) ON DELETE RESTRICT,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 9. NOTIFICATIONS TABLE
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    recipient_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    complaint_id UUID REFERENCES public.complaints(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    read_status BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 10. ANNOUNCEMENTS TABLE
CREATE TABLE IF NOT EXISTS public.announcements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    audience VARCHAR(100) DEFAULT 'All Hostel Residents',
    priority VARCHAR(50) DEFAULT 'Normal' CHECK (priority IN ('Normal', 'High', 'Critical')),
    author_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE RESTRICT,
    published_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 11. FEEDBACK TABLE
CREATE TABLE IF NOT EXISTS public.feedback (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    complaint_id UUID UNIQUE NOT NULL REFERENCES public.complaints(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    rating INT CHECK (rating >= 1 AND rating <= 5),
    comments TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 12. AUDIT LOGS (Security and administrative audit trail)
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    actor_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    action VARCHAR(150) NOT NULL,
    relevant_record VARCHAR(100),
    details TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.complaints ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.complaint_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;

-- Profiles: Users can view their own profile; Warden/Admins can view all profiles
CREATE POLICY "Users can view own profile" 
ON public.profiles FOR SELECT 
USING (auth.uid() = id OR (SELECT role FROM public.profiles WHERE id = auth.uid()) IN ('warden', 'admin'));

-- Complaints: Students can ONLY select their own complaints. Officials can view complaints assigned to their department or all if Warden/Admin
CREATE POLICY "Students see own complaints" 
ON public.complaints FOR SELECT 
USING (
    student_id = auth.uid() OR
    (SELECT role FROM public.profiles WHERE id = auth.uid()) IN ('warden', 'admin') OR
    (
        (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'staff' AND
        assigned_department IN (
            SELECT d.name FROM public.departments d
            JOIN public.department_members dm ON dm.department_id = d.id
            WHERE dm.user_id = auth.uid()
        )
    )
);

-- Students can insert complaints
CREATE POLICY "Students can insert complaints" 
ON public.complaints FOR INSERT 
WITH CHECK (student_id = auth.uid());

-- Notifications: Users can only see their own notifications
CREATE POLICY "Users view own notifications" 
ON public.notifications FOR SELECT 
USING (recipient_id = auth.uid());

-- Announcements: Everyone authenticated can view announcements
CREATE POLICY "Everyone can read announcements" 
ON public.announcements FOR SELECT 
USING (auth.role() = 'authenticated');

-- ============================================================================
-- SEED DATA FOR DEPARTMENTS
-- ============================================================================
INSERT INTO public.departments (name, description) VALUES
('Maintenance', 'Handles furniture, electrical circuits, water pipelines, cupboards, and fans.'),
('Sanitation', 'Handles bathroom drainage, wing cleanliness, waste disposal, and pest control.'),
('Mess Manager', 'Handles dining food quality, meal hygiene, and dining hall water supply.'),
('Dhobi Manager', 'Handles laundry pickup, missing/exchanged clothes, and ironing.'),
('Warden', 'Hostel-wide security, discipline, resident welfare, and critical escalations.')
ON CONFLICT (name) DO NOTHING;
