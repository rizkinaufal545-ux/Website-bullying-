-- SQL Schema for SMK Prima Unggul Anti-Bullying System

-- 1. Create Roles Enum
CREATE TYPE user_role AS ENUM ('admin', 'guru', 'siswa');
CREATE TYPE report_status AS ENUM ('pending', 'diproses', 'selesai');

-- 2. Create Profiles Table (linked to Auth)
CREATE TABLE profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  role user_role NOT NULL DEFAULT 'siswa',
  nis TEXT,
  class TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 3. Create Reports Table
CREATE TABLE reports (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  description TEXT NOT NULL,
  location TEXT NOT NULL,
  incident_date DATE NOT NULL,
  status report_status NOT NULL DEFAULT 'pending',
  is_anonymous BOOLEAN NOT NULL DEFAULT FALSE,
  evidence_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 4. Create Students Data Table (for admin management)
CREATE TABLE students_data (
  nis TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  class TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 5. Enable Row Level Security (RLS)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE students_data ENABLE ROW LEVEL SECURITY;

-- 6. RLS Policies

-- Profiles: Users can read their own profile, admins can read all
CREATE POLICY "Users can read own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Admins can read all profiles" ON profiles FOR SELECT USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Admins can update all profiles" ON profiles FOR UPDATE USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Reports: 
-- Siswa can create reports
CREATE POLICY "Siswa can create reports" ON reports FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'siswa')
);
-- Siswa can read their own reports
CREATE POLICY "Siswa can read own reports" ON reports FOR SELECT USING (student_id = auth.uid());
-- Guru and Admin can read all reports
CREATE POLICY "Staff can read all reports" ON reports FOR SELECT USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'guru'))
);
-- Guru and Admin can update report status
CREATE POLICY "Staff can update reports" ON reports FOR UPDATE USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'guru'))
);

-- Students Data: Only Admin can manage
CREATE POLICY "Admins can manage students data" ON students_data FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Staff can read students data" ON students_data FOR SELECT USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'guru'))
);

-- 7. Trigger to automatically create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (
    NEW.id, 
    NEW.email, 
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'User'),
    CASE 
      WHEN (SELECT COUNT(*) FROM public.profiles) = 0 THEN 'admin'::user_role
      ELSE 'siswa'::user_role
    END
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
