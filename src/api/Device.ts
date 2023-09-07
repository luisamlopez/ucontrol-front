import { url } from "./url";

export interface DeviceValues {
	timestamp?: Date;
	value?: number | string | boolean;
}

export interface Device {
	_id?: string;
	name: string;
	description: string;
	dvt: string[];
	createdBy: string;
	createdOn?: Date;
	type: string;
	history?: {
		updatedBy: string;
		updatedOn: Date;
		field: string[];
	}[];
	conditions?: {
		listenerDevice?: string;
		condition?: string;
		conditionValue?: string;
	};
	topic: string;
	/**
	 * @todo change this
	 */
	values?: DeviceValues[];
}

export interface UnitsConfig {
	label: string;
	value: string;
}

/**
 * Data visualization types
 */

//same for temperature and humidity and soil moisture
//numeric values
export const temperatureAndHumDVT: UnitsConfig[] = [
	{ label: "Gráfico de barras", value: "bar" },
	{ label: "Gráfico de líneas", value: "line" },
	{ label: "Gauge", value: "gauge" },
	{ label: "Solo valor", value: "value" },
];

//number of movements detected and if it detected movement or not
export const movementDVT: UnitsConfig[] = [
	{ label: "Gráfico de barras", value: "bar" },
	{ label: "Solo valor", value: "value" },
];

// on/off values  and timestamp
export const lightDVT: UnitsConfig[] = [
	{ label: "Tabla de valores de encendido/apagado", value: "table" },
];

// number of times water has been detected and if it detected water or not
export const waterFlowDVT: UnitsConfig[] = [
	{ label: "Gráfico de barras", value: "bar" },
	{ label: "Gráfico de líneas", value: "line" },
	{ label: "Solo valor", value: "value" },
];

// on/off values and timestamp
export const airDVT: UnitsConfig[] = [
	{ label: "Tabla de valores de encendido/apagado", value: "table" },
];

// number of people on a day
export const accessControlDVT: UnitsConfig[] = [
	{ label: "Gráfico de barras", value: "bar" },
];

// number of times vibrations have been detected and if it detected vibrations or not
export const vibrationsDVT: UnitsConfig[] = [
	{ label: "Gráfico de barras", value: "bar" },
	{ label: "Gráfico de líneas", value: "line" },
	{ label: "Solo valor", value: "value" },
];

// API calls

export const createDevice = async (
	deviceData: Device,
	spaceId: string,
	userName: string
) => {
	try {
		//   console.log(deviceData);
		const response = await fetch(`${url}createDevice`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				deviceData: deviceData,
				spaceId: spaceId,
				userName: userName,
			}),
		});
		console.log(response);
		if (response.ok) return true;
	} catch (error) {
		console.log(error);
		return false;
	}
};

export const getAllDevicesBySpace = async (
	spaceId: string,
	callback: (devices: Device[]) => void
) => {
	try {
		const response = await fetch(`${url}getAllDevicesBySpace`, {
			method: "POST", // Use POST instead of GET
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ spaceId }), // Send spaceId in the request body
		});
		if (!response.ok) {
			const error = await response.json();
			throw new Error(error.message);
		}

		const data = await response.json();

		callback(data.data);
	} catch (error) {
		console.log(error);
	}
};

export const getDeviceById = async (
	deviceId: string,
	callback: (device: Device) => void
) => {
	try {
		const response = await fetch(`${url}getDeviceById`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ id: deviceId }),
		});
		if (response.ok) {
			const data = await response.json();

			callback(data.data);
		}
		if (!response.ok) {
			const error = await response.json();
			console.log(deviceId);
		}
	} catch (error) {}
};

export const getAllDevicesByUser = async (
	userId: string,
	callback: (devices: Device[]) => void
) => {
	try {
		const response = await fetch(`${url}getUserDevices/${userId}`, {
			method: "GET",
			headers: { "Content-Type": "application/json" },
		});

		if (!response.ok) {
			const error = await response.json();
			throw new Error(error.message);
		}

		const data = await response.json();

		// console.log(data.data);
		// Check if 'data' object has a 'devices' property before accessing it
		if (data && data.data) {
			callback(data.data);
		} else {
			callback([]);
		}
	} catch (error) {
		console.log(error);
	}
};

export const updateDevice = async (
	deviceData: Device,
	id: string,
	fields: string[],
	username: string
) => {
	try {
		const response = await fetch(`${url}updateDevice`, {
			method: "PATCH",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				id: id,
				name: deviceData.name,
				description: deviceData.description,
				dvt: deviceData.dvt,
				topic: deviceData.topic,
				fields: fields,
				userName: username,
				conditions: deviceData.conditions,
			}),
		});

		if (response.ok) return true;
	} catch (error) {
		return false;
	}
};

export const deleteDevice = async (deviceId: string, userName: string) => {
	try {
		const response = await fetch(`${url}deleteDevice`, {
			method: "DELETE",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ id: deviceId, userName: userName }),
		});
		if (response.ok) return true;
	} catch (error) {
		return false;
	}
};

export const getSpaceFromDeviceId = async (
	deviceId: string,
	callback: (spaceId: string) => void
) => {
	try {
		const response = await fetch(`${url}getSpaceByDeviceId/${deviceId}`, {
			method: "get",
			headers: { "Content-Type": "application/json" },
		});

		// console.log(response);
		if (response.ok) {
			const data = await response.json();
			//  console.log(data.spaceId);
			callback(data.spaceId);
		}
		if (!response.ok) {
			const error = await response.json();
			throw new Error(error.message);
		}
	} catch (error) {}
};
