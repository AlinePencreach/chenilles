# 🐛 Chenilles à Vernègues

Application mobile communautaire de signalement des nids de chenilles processionnaires autour de Vernègues (13116, Bouches-du-Rhône).

Projet solo — fait par un habitant du village pour protéger les promeneurs, les enfants et les animaux domestiques. L'objectif est aussi de travailler en partenariat avec la mairie pour que les nids signalés soient traités.

---

## Pourquoi cette app ?

Les chenilles processionnaires sont classées nuisibles à la santé humaine depuis le décret n°2022-686 du 25 avril 2022. Leurs poils urticants peuvent provoquer des réactions graves chez les chiens (œdème de la langue) et des irritations chez les enfants. En mars 2025, plusieurs signalements ont circulé sur Facebook à Vernègues sans outil centralisé pour agir collectivement.

L'app résout ça : les habitants signalent, la mairie voit les nids sur une carte, les agents savent exactement où intervenir.

---

## Stack technique

| Couche | Technologie |
|---|---|
| App mobile | React Native + Expo |
| Carte | react-native-maps |
| Backend | Supabase (PostgreSQL + PostGIS) |
| Notifications | Expo Push Notifications (V2) |
| Auth | Aucune — UUID device anonyme |
| Build / Deploy | Expo EAS |
| Dev environment | Docker + Node 20 Alpine |

---

## Fonctionnalités V1

### 🗺 Carte
- Carte OpenStreetMap centrée sur Vernègues
- Marqueurs différenciés par catégorie (nid 🫧 / procession 🐛) et par ancienneté (rouge < 7j, orange plus anciens)
- Géolocalisation de l'utilisateur
- Popup par nid : lieu, description, date, distance, statut
- Bouton pour faire évoluer le statut depuis la popup

### ⚠️ Signaler un nid
- Bottom sheet (95% de hauteur écran)
- Choix du type : nid dans un arbre ou procession au sol
- Champ lieu (texte libre) et description optionnelle
- Placement de la position en tapant sur la carte
- Aucune inscription requise

### 📋 À proximité
- Liste de tous les nids signalés
- Tri par distance (Haversine) ou par date
- Badge de statut visible sur chaque item (signalé à la mairie / traité)
- Tap sur un item → flyTo sur la carte avec popup

### 📰 Actus
- Articles locaux sur Vernègues (chargés depuis Supabase)
- Contenu : contact mairie, qui fait quoi, urgence vétérinaire, saison
- Pastille rouge si nouvel article non lu
- Carte de soutien (Ko-fi)

---

## Statuts des nids

Chaque nid peut évoluer en 3 états :
- **Signalé** (rouge) — état initial
- **🏛️ Signalé à la mairie** (orange) — quelqu'un a prévenu la mairie
- **✅ Traité** (vert/grisé) — le nid a été détruit

---

## Fonctionnalités V2 (prévu)

- 📍 **Mode balade GPS** — géolocalisation en arrière-plan, détection automatique d'un nid à proximité
- 🔔 **Push notifications** — alerte quand on entre dans le rayon d'un nid signalé (rayon configurable : 50m / 100m / 200m / 500m)
- 📸 **Photo du nid** — upload depuis l'appareil photo, stocké sur Supabase Storage
- ⚙️ **Préférences** — rayon d'alerte, notifications on/off

---

## Structure du projet

```
chenilles/
├── app/
│   ├── (tabs)/
│   │   ├── index.tsx         ← Carte
│   │   ├── signaler.tsx      ← Signaler un nid
│   │   ├── proximite.tsx     ← À proximité
│   │   ├── actus.tsx         ← Actus
│   │   └── _layout.tsx       ← Config visuelle des tabs
│   └── _layout.tsx           ← Layout racine
├── components/               ← Composants réutilisables (Button, Badge, Toast…)
├── lib/                      ← Client Supabase, utilitaires (haversine…)
├── constants/                ← Couleurs, typographie (design system)
├── hooks/                    ← Logique réutilisable (useLocation, useNests…)
├── assets/fonts/             ← Fraunces + DM Mono
├── Dockerfile
├── docker-compose.yml
└── .env                      ← Clés Supabase (jamais commité)
```

---

## Design system

| Variable | Valeur | Usage |
|---|---|---|
| bark | #1A0E06 | Header, fond dark |
| moss | #375530 | Accents verts |
| lichen | #7A9E6E | Onglet actif, highlights |
| cream | #F6F1E4 | Fond principal |
| amber | #C98520 | Nids anciens, statut mairie |
| red | #C0402A | Nids récents, alertes |

Typographie : **Fraunces** (serif) pour les titres et textes, **DM Mono** pour les données (dates, distances, badges).

---

## Lancer le projet en dev

```bash
# Cloner le repo
git clone <url> chenilles
cd chenilles

# Lancer avec Docker
docker compose up
```

Scanner le QR code avec Expo Go sur ton téléphone (iOS ou Android).

### Variables d'environnement

Créer un fichier `.env` à la racine :

```
EXPO_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=xxxx
```

---

## Coûts

| Service | Coût |
|---|---|
| Supabase | Gratuit (free tier) |
| Expo EAS build | Gratuit (free tier) |
| Google Play | 25€ une fois |
| Apple Developer | 99€/an |
| Ko-fi (soutien) | 0€ (commission ~5% sur les dons) |

---

## Contexte légal

La chenille processionnaire du pin et du chêne est classée nuisible à la santé humaine (Code de la santé publique, décret 2022). Le maire est tenu d'intervenir sur le domaine public (article L.2212-2 du CGCT). Sur propriété privée, c'est au propriétaire d'agir — la mairie peut prendre un arrêté municipal l'y obligeant.

---



Projet open source — contributions bienvenues si tu es habitant de Vernègues ou des communes voisines.
