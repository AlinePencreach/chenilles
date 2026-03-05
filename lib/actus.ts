import type { Article } from './types';

/** Contenu éditorial statique — à remplacer par du Supabase quand le CMS sera en place. */
export const ACTUS: Article[] = [
  {
    id: 'a4',
    tag: 'communaute',
    tag_label: 'Vernègues',
    created_at: '2025-03-04T00:00:00Z',
    title: '🏛️ Travailler avec la mairie — comment l\'approcher',
    excerpt: 'La mairie est notre meilleure alliée. Voici comment lui présenter l\'app et proposer un vrai partenariat.',
    body: `La mairie est notre meilleure alliée. L'idée est simple : vous signalez les nids, la mairie sait exactement où envoyer ses agents. Tout le monde y gagne — les habitants sont protégés, et la commune peut agir efficacement sans chercher les nids elle-même.

Pour proposer le partenariat, arrivez avec l'app sur votre téléphone et montrez la carte du village. Dites simplement : "J'ai créé un outil gratuit pour que les habitants signalent les nids. Je vous l'offre comme outil de travail. Vos agents peuvent voir les signalements en temps réel."

Mairie de Vernègues : 📞 04 90 59 30 01

Pour savoir si la commune a déjà un plan d'action, demandez simplement : "Avez-vous un référent ou un prestataire pour les chenilles cette saison ?" — c'est neutre et ça ouvre la conversation.`,
  },
  {
    id: 'a3',
    tag: 'info',
    tag_label: 'Bon à savoir',
    created_at: '2025-02-28T00:00:00Z',
    title: '📋 Qui fait quoi face aux chenilles ?',
    excerpt: 'Nid chez le voisin, sur un chemin communal, dans un parc — ce n\'est pas la même chose.',
    body: `Sur le domaine public (chemin communal, parc, bord de route) : signalez à la mairie. Elle est en charge de l'entretien de ses espaces et peut faire intervenir ses agents ou un prestataire.

Sur une propriété privée (jardin du voisin, terrain) : c'est au propriétaire d'agir. Vous pouvez lui signaler aimablement — beaucoup de gens ne savent tout simplement pas que leurs pins sont infestés.

Vous ne savez pas de qui dépend l'arbre ? Signalez quand même sur la carte. La communauté et la mairie pourront identifier le responsable ensemble.

Le plus important : signalez tôt. Un nid traité en automne ou en hiver coûte 10 fois moins cher qu'une intervention en mars quand les chenilles sont au sol.`,
  },
  {
    id: 'a2',
    tag: 'info',
    tag_label: 'Urgence',
    created_at: '2025-02-15T00:00:00Z',
    title: '🐕 Mon animal a touché des chenilles — que faire ?',
    excerpt: 'Réaction rapide indispensable. Les gestes à faire dans les premières minutes et les numéros à appeler.',
    body: `Le contact avec les poils urticants peut provoquer chez le chien un gonflement de la langue et des muqueuses. C'est une urgence vétérinaire — n'attendez pas.

Gestes immédiats :
1. Ne touchez pas les chenilles à mains nues
2. Rincez abondamment la gueule de votre animal à grande eau, sans frotter
3. Appelez un vétérinaire immédiatement, même si les symptômes semblent légers

Vétérinaires proches de Vernègues :
— Salon-de-Provence : 04 90 53 00 00
— Urgences 24h/24 (Aix) : 04 42 39 00 93

Pour les enfants : en cas de contact avec la peau, rincez à grande eau, ne frottez pas, consultez un médecin si irritation persistante ou gêne respiratoire.`,
  },
  {
    id: 'a1',
    tag: 'saison',
    tag_label: 'Saison',
    created_at: '2025-02-01T00:00:00Z',
    title: '🌡️ Saison active à Vernègues — ce qu\'il faut savoir',
    excerpt: 'Mars est le mois le plus dangereux en Provence. Les processions au sol sont à leur pic.',
    body: `En Provence, la chenille processionnaire du pin descend des arbres entre janvier et avril. Le pic des processions au sol se situe en février-mars, quand les nuits sont encore fraîches mais les journées se réchauffent.

Les zones à surveiller autour de Vernègues : les chemins forestiers, les pins des garrigues, les jardins avec des pins ou des cèdres.

Un nid visible dans un arbre en ce moment contient des milliers de chenilles prêtes à descendre. Signalez-le sur la carte — ça prend 30 secondes et ça peut éviter un accident à un chien ou un enfant du village.

Merci à tous les habitants qui contribuent. Chaque signalement compte.`,
  },
];
