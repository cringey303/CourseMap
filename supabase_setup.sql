-- Create Profiles Table
CREATE TABLE profiles (
  id UUID REFERENCES auth.users NOT NULL PRIMARY KEY,
  role TEXT CHECK (role IN ('coach', 'coxswain')),
  team_name TEXT
);

-- Turn on RLS for Profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Allow users to view their own profile
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

-- Allow users to update their own profile
CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- Create Submissions Table
CREATE TABLE submissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) NOT NULL,
  media_url TEXT NOT NULL,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Turn on RLS for Submissions
ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;

-- Allow Coxswains to view only their own submissions
CREATE POLICY "Coxswains can view own submissions" ON submissions
  FOR SELECT USING (
    auth.uid() = user_id
  );

-- Allow Coaches to view all submissions
CREATE POLICY "Coaches can view all submissions" ON submissions
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'coach'
    )
  );

-- Allow Coxswains to insert their own submissions
CREATE POLICY "Coxswains can insert own submissions" ON submissions
  FOR INSERT WITH CHECK (
    auth.uid() = user_id
  );

-- Storage Setup: create a public bucket 'course-media'
INSERT INTO storage.buckets (id, name, public) VALUES ('course-media', 'course-media', true);

-- Policy to allow authenticated uploads to 'course-media'
CREATE POLICY "Authenticated users can upload media"
ON storage.objects FOR INSERT TO authenticated WITH CHECK (
  bucket_id = 'course-media' AND auth.uid() = owner
);

-- Policy to allow public to view media (since it's a public bucket, but good to be explicit/safe)
CREATE POLICY "Public can view media"
ON storage.objects FOR SELECT TO public USING (
  bucket_id = 'course-media'
);
