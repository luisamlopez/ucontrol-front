import { Device } from "./Device";

export interface SpaceRoute {
  id: string;
  label: string;
}

export interface Space {
  id: string;
  name: string;
  description: string;
  currentRoute: SpaceRoute[];
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
