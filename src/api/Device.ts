export interface MetricAndUnit {
  metric: string;
  unit: string;
  value: number;
}

type DataVisualizationType = "line" | "bar" | "pie" | "area" | "gauge";

export interface Device {
  id: string;
  name: string;
  description: string;
  currentTopic: string;
  createdBy: string;
  createdOn: string;
  dataVisualizationType: DataVisualizationType[];
  metricsAndUnits: MetricAndUnit[];
  history?: {
    name: string;
    description: string;
    topic: string;
    updatedBy: string;
    updatedOn: string;
    metricsAndUnits: MetricAndUnit[];
    dataVisualizationType: DataVisualizationType[];
  }[];
}
