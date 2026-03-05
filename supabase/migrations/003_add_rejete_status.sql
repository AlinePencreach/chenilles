-- ============================================================
-- Migration 003 : ajout du statut 'rejete'
-- Permet à la mairie de rejeter un signalement erroné ou doublé.
-- ============================================================

-- Mise à jour de la contrainte CHECK sur nests.status
ALTER TABLE public.nests
  DROP CONSTRAINT IF EXISTS nests_status_check,
  ADD CONSTRAINT nests_status_check
    CHECK (status IN ('signale', 'mairie', 'traite', 'rejete'));
