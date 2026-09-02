-- Add document_url to certifications for viewing certificate images/PDFs
ALTER TABLE public.certifications
  ADD COLUMN IF NOT EXISTS document_url text;

-- Add marksheet_url to education for viewing marksheet images/PDFs
ALTER TABLE public.education
  ADD COLUMN IF NOT EXISTS marksheet_url text;
