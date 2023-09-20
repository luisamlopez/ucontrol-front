import { url } from "./url";

export interface User {
  _id: string;
  name: string;
  email: string;
  registered: boolean;
  admin: boolean;
}

export interface Log {
  email: string;
  password: string;
}

export const signIn = async (logData: Log) => {
  try {
    const response = await fetch(`${url}login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(logData),
    });

    if (!response.ok) {
      const error = await response.json();
      console.log(error.message);
    }

    const data = await response.json();
    const { user } = data;

    return { success: true, user, message: "Inicio de sesión exitoso" };
  } catch (error) {
    if (error instanceof Error) {
      return { success: false, message: error.message };
    } else return { success: false, message: "Hubo un error desconocido" };
  }
};

export const sendCode = async (email: string) => {
  try {
    const response = await fetch(`${url}sendCode`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.log("pato");
      console.log(error);
      console.log(error.message);
    }

    const data = await response.json();
    const { code, message } = data;
    console.log(data);
    return { success: true, code, message };
  } catch (error) {
    if (error instanceof Error) {
      return { success: false, message: error.message };
    } else return { success: false, message: "Hubo un error desconocido" };
  }
};

export const signUp = async (signUpData: Log) => {
  try {
    const response = await fetch(`${url}firstTimeRegister`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(signUpData),
    });

    if (!response.ok) {
      const error = await response.json();

      console.log(error);
      console.log(error.message);
    }

    const data = await response.json();
    const { message } = data;

    return { message, success: true };
  } catch (error) {
    if (error instanceof Error) {
      return { success: false, message: error.message };
    } else return { success: false, message: "Hubo un error desconocido" };
  }
};

export const getUserById = async (
  id: string,
  callback: (user: User) => void
) => {
  try {
    const response = await fetch(`${url}getUserById/${id}`, {
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
