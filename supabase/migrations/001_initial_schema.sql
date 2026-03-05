-- ============================================================
-- Migration 001 : schéma initial Chenilles à Vernègues
-- ============================================================

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
  -- Flux : 'signale' → 'mairie' → 'traite'
  status      TEXT        NOT NULL DEFAULT 'signale'
                          CHECK (status IN ('signale', 'mairie', 'traite')),
  device_id   TEXT        NOT NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX nests_coords_idx         ON public.nests (latitude, longitude);
CREATE INDEX nests_status_created_idx ON public.nests (status, created_at DESC);

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
  tag        TEXT        NOT NULL CHECK (tag IN ('saison', 'feature', 'info', 'communaute')),
  tag_label  TEXT        NOT NULL,
  title      TEXT        NOT NULL,
  excerpt    TEXT        NOT NULL,
  body       TEXT        NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================
ALTER TABLE public.nests    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "nests_select_all"    ON public.nests FOR SELECT USING (true);
CREATE POLICY "nests_insert_anon"   ON public.nests FOR INSERT WITH CHECK (true);
CREATE POLICY "nests_update_status" ON public.nests FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "articles_select_all" ON public.articles FOR SELECT USING (true);

-- ============================================================
-- REALTIME
-- ============================================================
ALTER PUBLICATION supabase_realtime ADD TABLE public.nests;

-- ============================================================
-- DONNÉES DE TEST (à supprimer en production)
-- ============================================================
-- Coordonnées Vernègues (13116) : 43.5275 N, 5.3236 E
INSERT INTO public.nests (type, lieu, description, latitude, longitude, status, device_id) VALUES
  ('nid',       'Chemin des Oliviers, pin parasol au bord du chemin', 'Nid visible à environ 4m de hauteur, côté sud.', 43.5290, 5.3250, 'signale', 'seed-device-001'),
  ('procession','Route de Lambesc, après le virage du moulin',         NULL,                                              43.5255, 5.3210, 'mairie',  'seed-device-002'),
  ('nid',       'Sentier du Gaï, près de la source',                  'Petit nid récent, arbre isolé.',                  43.5280, 5.3270, 'traite',  'seed-device-003');

INSERT INTO public.articles (tag, tag_label, title, excerpt, body) VALUES
  (
    'communaute', 'Vernègues',
    '🏛️ Travailler avec la mairie — comment l''approcher',
    'La mairie est notre meilleure alliée. Voici comment lui présenter l''app et proposer un vrai partenariat.',
    'L''idée est simple : vous signalez les nids, la mairie sait exactement où envoyer ses agents.

Pour proposer le partenariat : arrivez avec l''app sur votre téléphone et montrez la carte du village. Dites : "J''ai créé un outil gratuit pour que les habitants signalent les nids. Vos agents peuvent voir les signalements en temps réel."

Mairie de Vernègues : 04 90 59 30 01'
  ),
  (
    'info', 'Bon à savoir',
    '📋 Qui fait quoi face aux chenilles ?',
    'Nid chez le voisin, sur un chemin communal, dans un parc — ce n''est pas la même chose.',
    'Sur le domaine public (chemin communal, parc, bord de route) : signalez à la mairie. Elle est en charge de l''entretien de ses espaces.

Sur une propriété privée : c''est au propriétaire d''agir. Vous pouvez lui signaler aimablement.

Le plus important : signalez tôt. Un nid traité en automne coûte 10 fois moins cher qu''une intervention en mars.'
  ),
  (
    'info', 'Urgence',
    '🐕 Mon animal a touché des chenilles — que faire ?',
    'Réaction rapide indispensable. Les gestes à faire dans les premières minutes et les numéros à appeler.',
    'Gestes immédiats :
1. Ne touchez pas les chenilles à mains nues
2. Rincez abondamment la gueule de votre animal à grande eau, sans frotter
3. Appelez un vétérinaire immédiatement, même si les symptômes semblent légers

Vétérinaires proches de Vernègues :
— Salon-de-Provence : 04 90 53 00 00
— Urgences 24h/24 (Aix) : 04 42 39 00 93'
  ),
  (
    'saison', 'Saison',
    '🌡️ Saison active à Vernègues — ce qu''il faut savoir',
    'Mars est le mois le plus dangereux en Provence. Les processions au sol sont à leur pic.',
    'En Provence, la chenille processionnaire du pin descend des arbres entre janvier et avril. Le pic des processions au sol se situe en février-mars.

Les zones à surveiller autour de Vernègues : les chemins forestiers, les pins des garrigues, les jardins avec des pins ou des cèdres.

Merci à tous les habitants qui contribuent. Chaque signalement compte.'
  );
