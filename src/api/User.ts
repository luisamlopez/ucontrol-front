import { url } from "./url";

export interface User {
	id: string;
	name: string;
	email: string;
	registered: boolean;
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
			console.log(error);
			throw new Error(error.message);
		}

		const data = await response.json();
		console.log(data);
		return data;
	} catch (error) {
		return error;
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

			console.log(error);
			throw new Error(error.message);
		}

		const data = await response.json();
		console.log(data);
		return data;
	} catch (error) {
		return error;
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
			throw new Error(error.message);
		}

		const data = await response.json();
		console.log(data);
		return data;
	} catch (error) {
		return error;
	}
};
