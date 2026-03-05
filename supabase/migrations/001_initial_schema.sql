-- ============================================================
-- Migration 001 : schéma initial Chenilles à Vernègues
-- ============================================================

-- Extension UUID (disponible par défaut sur Supabase)
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================
-- TABLE : nests
-- ============================================================
CREATE TABLE public.nests (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  type        TEXT        NOT NULL CHECK (type IN ('nid', 'procession')),
  lieu        TEXT        NOT NULL,
  description TEXT,
  latitude    FLOAT8      NOT NULL,
  longitude   FLOAT8      NOT NULL,
  status      TEXT        NOT NULL DEFAULT 'signale'
                          CHECK (status IN ('signale', 'signale_mairie', 'traite')),
  device_id   TEXT        NOT NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index géographique (distance, bbox)
CREATE INDEX nests_coords_idx ON public.nests (latitude, longitude);

-- Index pour filtrer par statut et date
CREATE INDEX nests_status_created_idx ON public.nests (status, created_at DESC);

-- Trigger : updated_at automatique
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER nests_updated_at
  BEFORE UPDATE ON public.nests
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ============================================================
-- TABLE : articles
-- ============================================================
CREATE TABLE public.articles (
  id         UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  title      TEXT        NOT NULL,
  body       TEXT        NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

-- nests : lecture publique, insertion anonyme, mise à jour du statut autorisée
ALTER TABLE public.nests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "nests_select_all"
  ON public.nests FOR SELECT
  USING (true);

CREATE POLICY "nests_insert_anon"
  ON public.nests FOR INSERT
  WITH CHECK (true);

-- Seule la colonne status peut être mise à jour (pas les coordonnées ni le lieu)
CREATE POLICY "nests_update_status_only"
  ON public.nests FOR UPDATE
  USING (true)
  WITH CHECK (true);

-- articles : lecture publique uniquement (écriture réservée au dashboard Supabase)
ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "articles_select_all"
  ON public.articles FOR SELECT
  USING (true);

-- ============================================================
-- REALTIME
-- ============================================================
-- Activer la réplication logique sur la table nests
ALTER PUBLICATION supabase_realtime ADD TABLE public.nests;

-- ============================================================
-- DONNÉES DE TEST (à supprimer en production)
-- ============================================================
INSERT INTO public.nests (type, lieu, description, latitude, longitude, status, device_id)
VALUES
  ('nid',       'Chemin des Oliviers, pin parasol au bord du chemin',   'Nid visible à environ 4m de hauteur, côté sud.', 43.6501, 5.2410, 'signale',        'seed-device-001'),
  ('procession','Route de Lambesc, après le virage du moulin',           NULL,                                              43.6455, 5.2370, 'signale_mairie', 'seed-device-002'),
  ('nid',       'Sentier du Gaï, près de la source',                    'Petit nid récent, arbre isolé.',                  43.6490, 5.2450, 'traite',         'seed-device-003');

INSERT INTO public.articles (title, body)
VALUES
  (
    'Que faire si votre chien touche une procession ?',
    'Appelez immédiatement votre vétérinaire. Ne touchez pas les chenilles à mains nues. Rincez la gueule de l''animal à grande eau. Les poils urticants peuvent provoquer un œdème de la langue pouvant être fatal. Vétérinaire de garde : 04 90 XX XX XX.'
  ),
  (
    'La saison des chenilles : de janvier à avril',
    'Les chenilles processionnaires du pin descendent de leurs nids entre janvier et avril pour s''enterrer et se transformer. C''est la période la plus dangereuse. Évitez les balades sous les pins par temps doux et restez sur les chemins balisés.'
  ),
  (
    'Le maire peut-il intervenir sur une propriété privée ?',
    'Sur le domaine public (routes, chemins communaux), la mairie a l''obligation d''intervenir (art. L.2212-2 CGCT). Sur propriété privée, le propriétaire doit agir. En cas de risque grave, le maire peut prendre un arrêté municipal.'
  );
