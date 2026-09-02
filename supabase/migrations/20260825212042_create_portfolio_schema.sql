/*
# Nursing Student Portfolio Schema

1. Overview
This creates a portfolio application for a nursing student with an admin panel.
The app has a sign-in screen (admin) so policies are scoped to `authenticated`.
The public portfolio page reads data as the anon role, so SELECT policies allow `anon, authenticated`.

2. New Tables
- `profile` — single-row table holding the nursing student's name, tagline, bio, hero image, contact info, and theme accent color.
- `education` — list of schools/programs the student attended (degree, school, dates, description).
- `clinical_experience` — clinical rotations and placements (facility, unit, dates, hours, description, skills practiced).
- `skills` — nursing skills with a proficiency level (Beginner, Intermediate, Advanced) and category.
- `certifications` — licenses/certs (name, issuer, issue date, expiry, credential id).
- `projects` — academic or community projects (title, description, link, image).
- `achievements` — awards, honors, scholarships (title, date, description).
- `contact_messages` — messages submitted from the public contact form (name, email, message, created_at).

3. Security
- RLS enabled on every table.
- Public (anon) can SELECT profile, education, clinical_experience, skills, certifications, projects, achievements.
- Only authenticated admin can INSERT/UPDATE/DELETE on content tables.
- contact_messages: anon can INSERT (anyone can submit a message), only authenticated can SELECT/DELETE.
*/

-- Profile (single row)
CREATE TABLE IF NOT EXISTS profile (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name text NOT NULL DEFAULT 'Jordan Rivera',
  tagline text NOT NULL DEFAULT 'Nursing Student | Future RN',
  bio text NOT NULL DEFAULT 'Compassionate nursing student dedicated to evidence-based, patient-centered care.',
  hero_image text,
  email text,
  phone text,
  location text,
  linkedin_url text,
  resume_url text,
  accent_color text NOT NULL DEFAULT 'teal',
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE profile ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "read_profile" ON profile;
CREATE POLICY "read_profile" ON profile FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "update_profile" ON profile;
CREATE POLICY "update_profile" ON profile FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "insert_profile" ON profile;
CREATE POLICY "insert_profile" ON profile FOR INSERT TO authenticated WITH CHECK (true);

-- Education
CREATE TABLE IF NOT EXISTS education (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  degree text NOT NULL,
  school text NOT NULL,
  start_date text,
  end_date text,
  description text,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE education ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "read_education" ON education;
CREATE POLICY "read_education" ON education FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "insert_education" ON education;
CREATE POLICY "insert_education" ON education FOR INSERT TO authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "update_education" ON education;
CREATE POLICY "update_education" ON education FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "delete_education" ON education;
CREATE POLICY "delete_education" ON education FOR DELETE TO authenticated USING (true);

-- Clinical experience
CREATE TABLE IF NOT EXISTS clinical_experience (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  facility text NOT NULL,
  unit text NOT NULL,
  start_date text,
  end_date text,
  hours int,
  description text,
  skills_practiced text,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE clinical_experience ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "read_clinical" ON clinical_experience;
CREATE POLICY "read_clinical" ON clinical_experience FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "insert_clinical" ON clinical_experience;
CREATE POLICY "insert_clinical" ON clinical_experience FOR INSERT TO authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "update_clinical" ON clinical_experience;
CREATE POLICY "update_clinical" ON clinical_experience FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "delete_clinical" ON clinical_experience;
CREATE POLICY "delete_clinical" ON clinical_experience FOR DELETE TO authenticated USING (true);

-- Skills
CREATE TABLE IF NOT EXISTS skills (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  category text NOT NULL DEFAULT 'Clinical',
  proficiency text NOT NULL DEFAULT 'Intermediate',
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE skills ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "read_skills" ON skills;
CREATE POLICY "read_skills" ON skills FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "insert_skills" ON skills;
CREATE POLICY "insert_skills" ON skills FOR INSERT TO authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "update_skills" ON skills;
CREATE POLICY "update_skills" ON skills FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "delete_skills" ON skills;
CREATE POLICY "delete_skills" ON skills FOR DELETE TO authenticated USING (true);

-- Certifications
CREATE TABLE IF NOT EXISTS certifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  issuer text,
  issue_date text,
  expiry_date text,
  credential_id text,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE certifications ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "read_certs" ON certifications;
CREATE POLICY "read_certs" ON certifications FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "insert_certs" ON certifications;
CREATE POLICY "insert_certs" ON certifications FOR INSERT TO authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "update_certs" ON certifications;
CREATE POLICY "update_certs" ON certifications FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "delete_certs" ON certifications;
CREATE POLICY "delete_certs" ON certifications FOR DELETE TO authenticated USING (true);

-- Projects
CREATE TABLE IF NOT EXISTS projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  link text,
  image text,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "read_projects" ON projects;
CREATE POLICY "read_projects" ON projects FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "insert_projects" ON projects;
CREATE POLICY "insert_projects" ON projects FOR INSERT TO authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "update_projects" ON projects;
CREATE POLICY "update_projects" ON projects FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "delete_projects" ON projects;
CREATE POLICY "delete_projects" ON projects FOR DELETE TO authenticated USING (true);

-- Achievements
CREATE TABLE IF NOT EXISTS achievements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  date text,
  description text,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "read_achievements" ON achievements;
CREATE POLICY "read_achievements" ON achievements FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "insert_achievements" ON achievements;
CREATE POLICY "insert_achievements" ON achievements FOR INSERT TO authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "update_achievements" ON achievements;
CREATE POLICY "update_achievements" ON achievements FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "delete_achievements" ON achievements;
CREATE POLICY "delete_achievements" ON achievements FOR DELETE TO authenticated USING (true);

-- Contact messages
CREATE TABLE IF NOT EXISTS contact_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  message text NOT NULL,
  read boolean NOT NULL DEFAULT false,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "read_messages" ON contact_messages;
CREATE POLICY "read_messages" ON contact_messages FOR SELECT TO authenticated USING (true);
DROP POLICY IF EXISTS "insert_messages" ON contact_messages;
CREATE POLICY "insert_messages" ON contact_messages FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "update_messages" ON contact_messages;
CREATE POLICY "update_messages" ON contact_messages FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "delete_messages" ON contact_messages;
CREATE POLICY "delete_messages" ON contact_messages FOR DELETE TO authenticated USING (true);

-- Seed profile row
INSERT INTO profile (id, full_name, tagline, bio)
SELECT gen_random_uuid(), 'Jordan Rivera', 'Nursing Student | Future RN',
'Compassionate nursing student with clinical experience across medical-surgical, pediatric, and community health settings. Dedicated to evidence-based, patient-centered care and health equity.'
WHERE NOT EXISTS (SELECT 1 FROM profile);

-- Seed education
INSERT INTO education (degree, school, start_date, end_date, description, sort_order)
SELECT 'Bachelor of Science in Nursing (BSN)', 'University of Health Sciences', '2022', '2026 (Expected)',
'Comprehensive nursing program covering anatomy, pharmacology, medical-surgical nursing, and community health.', 0
WHERE NOT EXISTS (SELECT 1 FROM education);

INSERT INTO education (degree, school, start_date, end_date, description, sort_order)
SELECT 'Certified Nursing Assistant (CNA)', 'Community College', '2020', '2021',
'Completed state-approved CNA program with 120 clinical hours.', 1
WHERE NOT EXISTS (SELECT 1 FROM education WHERE school = 'Community College');

-- Seed clinical
INSERT INTO clinical_experience (facility, unit, start_date, end_date, hours, description, skills_practiced, sort_order)
SELECT 'St. Mary Medical Center', 'Medical-Surgical Unit', 'Jan 2025', 'May 2025', 180,
'Provided direct patient care under RN supervision, including vitals, medication administration, and wound care.', 'Vital signs, EHR documentation, wound care, IV therapy', 0
WHERE NOT EXISTS (SELECT 1 FROM clinical_experience);

INSERT INTO clinical_experience (facility, unit, start_date, end_date, hours, description, skills_practiced, sort_order)
SELECT 'Children''s Hospital', 'Pediatric Unit', 'Sep 2024', 'Dec 2024', 120,
'Cared for pediatric patients with acute and chronic conditions, supporting families and educating caregivers.', 'Pediatric assessment, family communication, medication safety', 1
WHERE NOT EXISTS (SELECT 1 FROM clinical_experience WHERE facility = 'Children''s Hospital');

-- Seed skills
INSERT INTO skills (name, category, proficiency, sort_order)
SELECT 'Vital Signs Monitoring', 'Clinical', 'Advanced', 0
WHERE NOT EXISTS (SELECT 1 FROM skills);
INSERT INTO skills (name, category, proficiency, sort_order)
SELECT 'Wound Care', 'Clinical', 'Intermediate', 1
WHERE NOT EXISTS (SELECT 1 FROM skills WHERE name = 'Wound Care');
INSERT INTO skills (name, category, proficiency, sort_order)
SELECT 'IV Therapy', 'Clinical', 'Intermediate', 2
WHERE NOT EXISTS (SELECT 1 FROM skills WHERE name = 'IV Therapy');
INSERT INTO skills (name, category, proficiency, sort_order)
SELECT 'Patient Education', 'Communication', 'Advanced', 3
WHERE NOT EXISTS (SELECT 1 FROM skills WHERE name = 'Patient Education');
INSERT INTO skills (name, category, proficiency, sort_order)
SELECT 'EHR Documentation', 'Technical', 'Advanced', 4
WHERE NOT EXISTS (SELECT 1 FROM skills WHERE name = 'EHR Documentation');
INSERT INTO skills (name, category, proficiency, sort_order)
SELECT 'CPR & BLS', 'Certification', 'Advanced', 5
WHERE NOT EXISTS (SELECT 1 FROM skills WHERE name = 'CPR & BLS');

-- Seed certifications
INSERT INTO certifications (name, issuer, issue_date, expiry_date, credential_id, sort_order)
SELECT 'Basic Life Support (BLS)', 'American Heart Association', '2024-03', '2026-03', 'AHA-2024-8842', 0
WHERE NOT EXISTS (SELECT 1 FROM certifications);
INSERT INTO certifications (name, issuer, issue_date, expiry_date, credential_id, sort_order)
SELECT 'Certified Nursing Assistant', 'State Board of Nursing', '2021-06', NULL, 'CNA-2021-5510', 1
WHERE NOT EXISTS (SELECT 1 FROM certifications WHERE name = 'Certified Nursing Assistant');

-- Seed projects
INSERT INTO projects (title, description, link, image, sort_order)
SELECT 'Community Health Education Initiative', 'Developed and delivered culturally-tailored health education workshops on diabetes management for underserved populations, reaching 120+ community members.', NULL, NULL, 0
WHERE NOT EXISTS (SELECT 1 FROM projects);
INSERT INTO projects (title, description, link, image, sort_order)
SELECT 'Capstone: Reducing Hospital Readmissions', 'Evidence-based project analyzing readmission factors and proposing a nurse-led discharge education protocol to reduce 30-day readmission rates.', NULL, NULL, 1
WHERE NOT EXISTS (SELECT 1 FROM projects WHERE title = 'Capstone: Reducing Hospital Readmissions');

-- Seed achievements
INSERT INTO achievements (title, date, description, sort_order)
SELECT 'Dean''s List', '2024', 'Recognized for academic excellence with GPA above 3.8 for four consecutive semesters.', 0
WHERE NOT EXISTS (SELECT 1 FROM achievements);
INSERT INTO achievements (title, date, description, sort_order)
SELECT 'Nursing Scholarship Recipient', '2023', 'Awarded competitive scholarship for commitment to community health and academic achievement.', 1
WHERE NOT EXISTS (SELECT 1 FROM achievements WHERE title = 'Nursing Scholarship Recipient');
