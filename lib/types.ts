export type NestType = 'nid' | 'procession';

export type NestStatus = 'signale' | 'mairie' | 'traite' | 'rejete';

export type Nest = {
  id: string;
  type: NestType;
  lieu: string;
  description: string | null;
  latitude: number;
  longitude: number;
  status: NestStatus;
  device_id: string;
  created_at: string;
  updated_at: string;
};

export type Article = {
  id: string;
  tag: 'saison' | 'feature' | 'info' | 'communaute';
  tag_label: string;
  title: string;
  excerpt: string;
  body: string;
  created_at: string;
};

export type Coords = {
  latitude: number;
  longitude: number;
};
