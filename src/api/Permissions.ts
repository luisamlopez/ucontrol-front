import { url } from "./url";

export interface Permission {
	_id?: string;
	spaceId: string;
	userId: string;
	permission: "read" | "readWrite";
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
			throw new Error(error.message);
		}

		if (response.ok)
			return { success: true, message: "Se ha creado el permiso exitosamente" };
	} catch (error) {
		if (error instanceof Error) {
			return { success: false, message: error.message };
		} else return { success: false, message: "Hubo un error desconocido" };
	}
};
