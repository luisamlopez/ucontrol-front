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
		console.log(response);
		if (response.ok) return true;
	} catch (error) {
		return false;
	}
};
