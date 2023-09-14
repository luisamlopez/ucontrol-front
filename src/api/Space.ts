import { Device } from "./Device";
import { url } from "./url";

export interface Space {
  _id?: string;
  name: string;
  description?: string;
  createdBy: string;
  createdOn?: Date;
  devices?: string[];
  history?: {
    field: string[];
    updatedBy: string;
    updatedOn: Date;
  }[];
  parentSpace?: string;
  subSpaces?: string[];
}

export const createSpace = async (spaceData: Space, userId: string) => {
  try {
    // console.log(spaceData);
    const response = await fetch(`${url}createSpace`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ space: spaceData, userId: userId }),
    });
    console.log(response);
    if (response.ok) return true;
  } catch (error) {
    return false;
  }
};

export const createSubSpace = async (newSubspace: Space, spaceId: string) => {
  try {
    const response = await fetch(`${url}createSubspace`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ newSubspace: newSubspace, spaceId: spaceId }),
    });
    if (response.ok) return true;
  } catch (error) {
    return false;
  }
};

export const getParentSpaces = async (
  userId: string | undefined,
  callback: (spaces: Space[]) => void
) => {
  try {
    const response = await fetch(`${url}getUserParentSpaces/${userId}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    //   console.log(response);
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message);
    }

    const spaces = await response.json();
    callback(spaces.data);
  } catch (error) {
    console.log(error);
  }
};

export const getSpaces = async (
  userId: string,
  callback: (spaces: Space[]) => void
) => {
  try {
    const response = await fetch(`${url}getUserSpaces/${userId}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    //   console.log(response);
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message);
    }

    const spaces = await response.json();
    console.log(spaces.data);
    callback(spaces.data);
  } catch (error) {
    console.log(error);
  }
};

export const updateSpace = async (
  fields: string[],
  spaceId: string,
  username: string,
  spaceUpdate: Space
) => {
  console.log(spaceUpdate);

  try {
    const response = await fetch(`${url}updateSpace`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fields: fields,
        spaceId: spaceId,
        userName: username,
        spaceUpdate: spaceUpdate,
      }),
    });
    console.log(response);
    if (response.ok) return true;
  } catch (error) {
    return false;
  }
};

export const getSpaceById = async (
  spaceId: string,
  callback: (space: Space) => void
) => {
  try {
    const response = await fetch(`${url}getSpaceById/${spaceId}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message);
    }

    const data = await response.json();
    //   console.log(data.data);
    callback(data.data);
  } catch (error) {
    console.log(error);
  }
};

export const deleteSpace = async (spaceId: string) => {
  try {
    const response = await fetch(`${url}deleteSpace`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ spaceId: spaceId }),
    });
    if (response.ok) return true;
  } catch (error) {
    return false;
  }
};

export const getACSpaces = async (
  userId: string,
  callback: (spaces: Space[]) => void
) => {
  try {
    const response = await fetch(`${url}getSpacesWithAccessControl/${userId}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    //   console.log(response);
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message);
    }

    const spaces = await response.json();
    console.log(spaces.data);
    callback(spaces.data);
  } catch (error) {
    console.log(error);
  }
};

export const updateStatusSpace = async (spaceId: string, status: boolean) => {
  try {
    const response = await fetch(`${url}changeStatusSpace/${spaceId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        status: status,
      }),
    });
    console.log(response);
    if (response.ok) return true;
    if (!response.ok) {
      return false;
    }
  } catch (error) {
    return false;
  }
};
