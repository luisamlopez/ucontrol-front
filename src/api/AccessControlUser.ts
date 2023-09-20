import { url } from "./url";

export interface AccessControlUser {
  _id: string;
  name: string;
  email: string;
  role: string;
  career: string;
  eCard: string;
  ci: string;
}

export const getAccessControlSpaceUserHistory = async (
  deviceId: string,
  callback: (data: any[]) => void
) => {
  try {
    const response = await fetch(
      `${url}getAccessControlSpaceUserHistory/${deviceId}`,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      }
    );
    const data = await response.json();
    if (!response.ok) {
      const error = await response.json();
      console.log(error.message);
    } else {
      callback(data.data);
    }
  } catch (error) {
    console.log(error);
  }
};

export const getAccessControlSpaceUsers = async (
  deviceId: string,
  callback: (data: any[]) => void
) => {
  try {
    const response = await fetch(
      `${url}getAccessControlSpaceUsers/${deviceId}`,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      }
    );
    const data = await response.json();
    if (!response.ok) {
      const error = await response.json();
      console.log(error.message);
    } else {
      callback(data.data);
    }
  } catch (error) {
    console.log(error);
  }
};
