-- CREATORRING | Actualización NO destructiva de la tabla 'eventos'.
-- IMPORTANTE: hacer copia de seguridad de la tabla antes de ejecutar SQL.
-- Supabase > SQL Editor > New query > pegar > Run (una sola vez).
--
-- Solo agrega columnas que falten; conserva todos los registros existentes.
-- La tabla 'eventos' debe existir previamente y tener 'id' bigint como PK.
-- Esta migración NO cambia RLS, políticas ni roles: conserva la seguridad existente.
--
-- Si ya tienes campos equivalentes con otros nombres (p.ej. titulo),
-- el campo 'nombre' nuevo quedará vacío: revisa/migra los valores manualmente.

ALTER TABLE IF EXISTS public.eventos
  ADD COLUMN IF NOT EXISTS nombre text,
  ADD COLUMN IF NOT EXISTS fecha date,
  ADD COLUMN IF NOT EXISTS organizador text,
  ADD COLUMN IF NOT EXISTS lugar text,
  ADD COLUMN IF NOT EXISTS descripcion text;

-- Verifica columnas disponibles. No altera datos.
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_schema = 'public' AND table_name = 'eventos'
ORDER BY ordinal_position;

-- Comprueba por separado las políticas RLS:
SELECT tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public' AND tablename IN ('peleadores','combates','eventos');
