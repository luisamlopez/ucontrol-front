import { url } from "./url";

export interface MetricAndUnit {
  metric: string;
  unit: string;
}

export interface DeviceValues {
  timestamp?: Date;
  value?: number | string | boolean;
  metricsAndUnits?: MetricAndUnit[];
}

export interface Device {
  _id?: string;
  name: string;
  description: string;
  dvt: ("line" | "bar" | "pie" | "gauge" | "scatter" | "table" | "value")[];
  createdBy: string;
  createdOn: Date;
  history?: {
    updatedBy: string;
    updatedOn: Date;
    field: string[];
  }[];
  /**
   * @todo change this
   */
  topic: string;
  values?: DeviceValues[];
}

export interface UnitsConfig {
  label: string;
  value: string;
}

/**
 * Data visualization types
 */
export const movementDVT: UnitsConfig[] = [
  { label: "Diagrama de dispersión", value: "scatter" },
  { label: "Solo valor", value: "value" },
];

export const temperatureAndHumDVT: UnitsConfig[] = [
  { label: "Gráfico de barras", value: "bar" },
  { label: "Gráfico de líneas", value: "line" },
  { label: "Gauge", value: "gauge" },
  { label: "Solo valor", value: "value" },
];

export const waterFlowDVT: UnitsConfig[] = [
  { label: "Gráfico de barras", value: "bar" },
  { label: "Gráfico de líneas", value: "line" },
  { label: "Solo valor", value: "value" },
];

export const vibrationsDVT: UnitsConfig[] = [
  { label: "Gráfico de barras", value: "bar" },
  { label: "Gráfico de líneas", value: "line" },
];

export const lightDVT: UnitsConfig[] = [
  { label: "Gráfico de barras", value: "bar" },
  { label: "Gráfico de pastel", value: "pie" },
];

export const airDVT: UnitsConfig[] = [
  { label: "Tabla de valores de encendido/apagado", value: "table" },
];

export const accessControlDVT: UnitsConfig[] = [
  { label: "Gráfico de barras", value: "bar" },
];

// API calls

export const createDevice = async (deviceData: Device, spaceId: string) => {
  try {
    console.log(deviceData);
    const response = await fetch(`${url}createDevice`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ device: deviceData, spaceId: spaceId }),
    });
    if (response.ok) return true;
  } catch (error) {
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
    console.log(data.devices);
    callback(data.devices);
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
      body: JSON.stringify({ deviceId: deviceId }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message);
    }

    const data = await response.json();
    callback(data.device);
  } catch (error) {
    console.log(error);
  }
};

export const getAllDevicesByUser = async (
  userId: string,
  callback: (devices: Device[]) => void
) => {
  try {
    // console.log(userId);
    const response = await fetch(`${url}devicesByUser`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: userId }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message);
    }

    const data = await response.json();
    // console.log(data.data);
    // Check if 'data' object has a 'devices' property before accessing it
    if (data && data.data) {
      console.log("Devices found for the user.");
      console.log(data.data);
      callback(data.data);
    } else {
      console.log("No devices found for the user.");
      callback([]);
    }
  } catch (error) {
    console.log(error);
  }
};
