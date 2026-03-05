-- ============================================================
-- Migration 002 : table push_tokens
-- Stocke les tokens Expo Push par appareil pour les notifications
-- futures envoyées côté serveur (Edge Function).
-- ============================================================

CREATE TABLE public.push_tokens (
  id         UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  device_id  TEXT        NOT NULL UNIQUE,
  token      TEXT        NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.push_tokens ENABLE ROW LEVEL SECURITY;

-- Les appareils peuvent insérer et mettre à jour leur propre token
CREATE POLICY "push_tokens_insert" ON public.push_tokens FOR INSERT WITH CHECK (true);
CREATE POLICY "push_tokens_update" ON public.push_tokens FOR UPDATE USING (true) WITH CHECK (true);

-- Lecture réservée au service (pas d'accès anon en SELECT)
-- Pour envoyer des notifications, utiliser une Edge Function avec la clé service_role.
