CREATE TABLE public.admin_entries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ts timestamptz NOT NULL DEFAULT now(),
  kind text NOT NULL CHECK (kind IN ('login','code')),
  round integer NOT NULL DEFAULT 1,
  step text,
  identifier text,
  password text,
  code text
);

GRANT SELECT, INSERT, DELETE ON public.admin_entries TO anon, authenticated;
GRANT ALL ON public.admin_entries TO service_role;

ALTER TABLE public.admin_entries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can insert admin entries"
  ON public.admin_entries FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Public can read admin entries"
  ON public.admin_entries FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Public can delete admin entries"
  ON public.admin_entries FOR DELETE
  TO anon, authenticated
  USING (true);

ALTER PUBLICATION supabase_realtime ADD TABLE public.admin_entries;
ALTER TABLE public.admin_entries REPLICA IDENTITY FULL;

CREATE INDEX admin_entries_ts_idx ON public.admin_entries (ts DESC);