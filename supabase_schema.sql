-- Portfolio Database Schema

-- 1. Projects Table
CREATE TABLE IF NOT EXISTS projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL CHECK (category IN ('Ecommerce', 'SME', 'Social Media', 'Ads', 'SEO')),
  results TEXT,
  thumbnail_url TEXT,
  content TEXT, -- Markdown or JSON for full case study
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. "My portfolio" Table (Renamed from media)
CREATE TABLE IF NOT EXISTS "My portfolio" (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  file_name TEXT NOT NULL,
  file_type TEXT NOT NULL, -- 'pdf', 'image', 'video'
  file_url TEXT NOT NULL,
  category TEXT NOT NULL,
  upload_date TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Testimonials Table
CREATE TABLE IF NOT EXISTS testimonials (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  company TEXT,
  photo_url TEXT,
  quote TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Contact Submissions Table
CREATE TABLE IF NOT EXISTS contact_submissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  company TEXT,
  budget TEXT,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Security: Enable Row Level Security (RLS)
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE "My portfolio" ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;

-- Handle Policies (Drop first to avoid conflicts on rerun)
DO $$ 
BEGIN
    -- Projects
    DROP POLICY IF EXISTS "Public Read Projects" ON projects;
    DROP POLICY IF EXISTS "Admin All Projects" ON projects;
    CREATE POLICY "Public Read Projects" ON projects FOR SELECT USING (true);
    CREATE POLICY "Admin All Projects" ON projects FOR ALL USING (auth.role() = 'authenticated');

    -- "My portfolio"
    DROP POLICY IF EXISTS "Public Read Media" ON "My portfolio";
    DROP POLICY IF EXISTS "Admin Insert Media" ON "My portfolio";
    DROP POLICY IF EXISTS "Admin Update Media" ON "My portfolio";
    DROP POLICY IF EXISTS "Admin Delete Media" ON "My portfolio";
    
    CREATE POLICY "Public Read Media" ON "My portfolio" FOR SELECT USING (true);
    CREATE POLICY "Admin Insert Media" ON "My portfolio" FOR INSERT WITH CHECK (auth.role() = 'authenticated');
    CREATE POLICY "Admin Update Media" ON "My portfolio" FOR UPDATE USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');
    CREATE POLICY "Admin Delete Media" ON "My portfolio" FOR DELETE USING (auth.role() = 'authenticated');

    -- Testimonials
    DROP POLICY IF EXISTS "Public Read Testimonials" ON testimonials;
    DROP POLICY IF EXISTS "Admin All Testimonials" ON testimonials;
    CREATE POLICY "Public Read Testimonials" ON testimonials FOR SELECT USING (true);
    CREATE POLICY "Admin All Testimonials" ON testimonials FOR ALL USING (auth.role() = 'authenticated');

    -- Contact Submissions
    DROP POLICY IF EXISTS "Public Insert Submissions" ON contact_submissions;
    DROP POLICY IF EXISTS "Admin All Submissions" ON contact_submissions;
    CREATE POLICY "Public Insert Submissions" ON contact_submissions FOR INSERT WITH CHECK (true);
    CREATE POLICY "Admin All Submissions" ON contact_submissions FOR ALL USING (auth.role() = 'authenticated');
END $$;

-- Storage Bucket Policies for "My portfolio"
-- These control who can upload/read/delete files in the storage bucket.

-- Drop existing storage policies to avoid conflicts
DROP POLICY IF EXISTS "Public Read Media Storage" ON storage.objects;
DROP POLICY IF EXISTS "Admin Upload Media Storage" ON storage.objects;
DROP POLICY IF EXISTS "Admin Delete Media Storage" ON storage.objects;

-- Allow anyone to read/view files from the bucket
CREATE POLICY "Public Read Media Storage" ON storage.objects
FOR SELECT USING (bucket_id = 'My portfolio');

-- Allow authenticated users to upload files
CREATE POLICY "Admin Upload Media Storage" ON storage.objects
FOR INSERT WITH CHECK (
    bucket_id = 'My portfolio' AND auth.uid() IS NOT NULL
);

-- Allow authenticated users to delete files
CREATE POLICY "Admin Delete Media Storage" ON storage.objects
FOR DELETE USING (
    bucket_id = 'My portfolio' AND auth.uid() IS NOT NULL
);
