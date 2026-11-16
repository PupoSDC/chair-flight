-- Supabase keeps extensions in their own schema, the migrations expect that.
CREATE SCHEMA IF NOT EXISTS extensions;
ALTER DATABASE chair_flight SET search_path TO "$user", public, extensions;
