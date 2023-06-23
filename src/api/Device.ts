export interface MetricAndUnit {
  metric: string;
  unit: string;
}

type DataVisualizationType = "line" | "bar" | "pie" | "gauge";

export interface DeviceValues {
  timestamp?: string;
  value?: number | string | boolean;
  metricsAndUnits?: MetricAndUnit[];
}

export interface Device {
  id: string;
  name: string;
  description: string;
  currentTopic: string;
  createdBy: string;
  createdOn: string;
  values: DeviceValues[];
  dataVisualizationType: DataVisualizationType[];
  history?: {
    name: string;
    description: string;
    topic: string;
    updatedBy: string;
    updatedOn: string;
    dataVisualizationType: DataVisualizationType[];
    values: DeviceValues[];
  }[];
}
