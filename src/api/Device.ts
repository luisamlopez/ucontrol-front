export interface MetricAndUnit {
  metric: string;
  unit: string;
  value: string;
}

export interface Device {
  id: string;
  name: string;
  description: string;
  currentTopic: string;
  createdBy: string;
  createdOn: string;
  metricsAndUnits: MetricAndUnit[];
  history?: {
    name: string;
    description: string;
    topic: string;
    updatedBy: string;
    updatedOn: string;
    metricsAndUnits: MetricAndUnit[];
  }[];
}
