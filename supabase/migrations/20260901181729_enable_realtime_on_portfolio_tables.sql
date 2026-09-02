-- Enable Supabase Realtime for portfolio tables.
-- Safe to run repeatedly.

DO $$
DECLARE
  target_table text;
BEGIN
  FOREACH target_table IN ARRAY ARRAY[
    'profile',
    'education',
    'clinical_experience',
    'skills',
    'certifications',
    'projects',
    'achievements',
    'contact_messages'
  ]
  LOOP
    IF EXISTS (
      SELECT 1
      FROM pg_publication_tables
      WHERE pubname = 'supabase_realtime'
        AND schemaname = 'public'
        AND tablename = target_table
    ) THEN
      CONTINUE;
    END IF;

    EXECUTE format(
      'ALTER PUBLICATION supabase_realtime ADD TABLE public.%I',
      target_table
    );
  END LOOP;
END
$$;