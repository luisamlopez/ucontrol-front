import { Device } from "./Device";
import { url } from "./url";

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
	parentSpace?: string;
	subSpaces?: Space[];
}

export const createSpace = async (spaceData: Space) => {
	try {
		const response = await fetch(`${url}createSpace`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(spaceData),
		});
	} catch (error) {}
};

export const createSubSpace = async (subSpaceData: Space) => {
	try {
		const response = await fetch(`${url}createSpace`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(subSpaceData),
		});
	} catch (error) {}
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
