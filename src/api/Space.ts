import { Device } from "./Device";

export interface Space {
  id: string;
  name: string;
  description: string;
  createdBy: string;
  createdOn: Date;
  devices?: Device[];
  history?: {
    field: string[];
    updatedBy: string;
    updatedOn: Date;
  }[];
  parentSpace?: Space;
  subSpaces?: Space[];
}
