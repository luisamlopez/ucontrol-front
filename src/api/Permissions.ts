import { url } from "./url";

export interface Permission {
  _id?: string;
  spaceId: string;
  userId: string;
  permission: "read" | "readWrite";
}

export interface PermissionInfo {
  id: string;
  spaceName: string;
  userId: string;
  userName: string;
  userEmail: string;
  type: string;
}
export const createPermission = async (
  spaceId: string,
  permission: string,
  email: string
) => {
  try {
    const response = await fetch(`${url}permission`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: email,
        spaceId: spaceId,
        permission: permission,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.log(error.message);
    }

    if (response.ok)
      return { success: true, message: "Se ha creado el permiso exitosamente" };
  } catch (error) {
    if (error instanceof Error) {
      return { success: false, message: error.message };
    } else return { success: false, message: "Hubo un error desconocido" };
  }
};

export const getUserPermissions = async (
  userId: string,
  callback: (data: PermissionInfo[]) => void
) => {
  try {
    const response = await fetch(`${url}getUserPermissions/${userId}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    if (!response.ok) {
      const error = await response.json();
      console.log(error.message);
    }

    const data = await response.json();

    callback(data.data);
  } catch (error) {
    console.log(error);
  }
};

export const deletePermission = async (permissionId: string) => {
  try {
    const response = await fetch(`${url}deletePermission`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: permissionId }),
    });
    if (!response.ok) {
      const error = await response.json();
      console.log(error.message);
    }

    if (response.ok) {
      return true;
    }
  } catch (error) {
    console.log(error);
    return false;
  }
};
