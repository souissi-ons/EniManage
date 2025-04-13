import { Resource } from './resource';

export interface Salle {
  id?: number;
  name: string;
  batiment: 'Principal' | 'Annexe';
  capacity: number;
  description: string;
  ressources?: ResourceSalle[];
}

export interface ResourceSalle {
  id?: number;
  salle: Salle;
  resource: Resource;
  quantity: number;
}
