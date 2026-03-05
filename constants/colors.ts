export const colors = {
  bark: '#1A0E06',    // Header, fond dark
  moss: '#375530',    // Accents verts
  lichen: '#7A9E6E',  // Onglet actif, highlights
  cream: '#F6F1E4',   // Fond principal
  amber: '#C98520',   // Nids anciens, statut mairie
  red: '#C0402A',     // Nids récents, alertes
  green: '#3A7D3F',   // Nids traités
} as const;

export type ColorKey = keyof typeof colors;
