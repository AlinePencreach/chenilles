export type NestType = 'nid' | 'procession';

export type NestStatus = 'signale' | 'signale_mairie' | 'traite';

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

export type Coords = {
  latitude: number;
  longitude: number;
};
