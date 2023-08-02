import { Device } from "./Device";
import { url } from "./url";

export interface SpaceRoute {
  _id: string;
  label: string;
}

export interface Space {
  _id?: string;
  name: string;
  description?: string;
  createdBy: string;
  createdOn?: Date;
  devices?: Device[];
  history?: {
    name: string;
    description: string;
    route?: string;
    updatedBy: string;
    updatedOn: Date;
  }[];
  parentSpace?: string;
  subSpaces?: string[];
}

export const createSpace = async (spaceData: Space, userId: string) => {
  try {
    console.log(spaceData);
    const response = await fetch(`${url}createSpace`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ space: spaceData, userId: userId }),
    });
    if (response.ok) return true;
  } catch (error) {
    return false;
  }
};

export const createSubSpace = async (subSpaceData: Space, userId: string) => {
  try {
    const response = await fetch(`${url}createSpace`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ space: subSpaceData, userId: userId }),
    });
    if (response.ok) return true;
  } catch (error) {
    return false;
  }
};

export const getSpaces = async (callback: (spaces: Space[]) => void) => {
  try {
    const response = await fetch(`${url}getAllSpaces`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message);
    }

    const data = await response.json();
    callback(data.spaces);
  } catch (error) {}
};
