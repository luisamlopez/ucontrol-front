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
  _id: string;
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
  topic: string[];
  values?: DeviceValues[];
}

export interface UnitsConfig {
  label: string;
  value: string;
}

/**
 * Units
 */
export const temperatureUnits: UnitsConfig[] = [
  { label: "Celsius", value: "celcius" },
  { label: "Fahrenheit", value: "farenheit" },
  { label: "Kelvin", value: "kelvin" },
];

export const humidityUnits: UnitsConfig = {
  label: "Porcentaje (%)",
  value: "percentage",
};
export const waterFlowUnits: UnitsConfig[] = [
  { label: "Litros", value: "lts" },
  { label: "Metros cúbicos", value: "m3" },
];

export const vibrationsUnits: UnitsConfig[] = [
  { label: "Aceleración (m/s²)", value: "ms2" },
  { label: "Velocidad (m/s)", value: "ms" },
  { label: "Desplazamiento (mm)", value: "mm" },
];

/**
 * Data visualization types
 */
export const movementDVT: UnitsConfig[] = [
  { label: "Diagrama de dispersión", value: "scatter" },
];

export const temperatureAndHumDVT: UnitsConfig[] = [
  { label: "Gráfico de barras", value: "bar" },
  { label: "Gráfico de líneas", value: "line" },
  { label: "Gauge", value: "gauge" },
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

export const accessControl: UnitsConfig[] = [
  { label: "Gráfico de barras", value: "bar" },
];
