import { Device } from "./Device";

export interface Space {
  id: string;
  name: string;
  description: string;
  currentRoute?: string; // Esto es el path del espacio, padre e hijos si lo tiene? Pienso tambien en un arreglo de hijos si aplica pero no se como hacer con los que no tienen hijos o no se si me estoy complicando mucho
  createdBy: string;
  createdOn: string;
  devices?: Device[];
  history?: {
    name: string;
    description: string;
    route?: string;
    updatedBy: string;
    updatedOn: string;
  }[];
}
