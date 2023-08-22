import { DeviceValues } from "./Device";

export interface Columns {
  field: string;
  headerName: string;
}
export interface ChartDataProps {
  id?: string;
  values: DeviceValues[];
  historyData?: {
    argument: string;
    value: number;
  }[];
}

export interface THChartProps {
  deviceName: string;
  deviceId: string;
  values: {
    valueT: number;
    valueH: number;
    timestamp: Date;
  }[];
}

export interface HChartProps {
  deviceName: string;
  deviceId: string;
  values: {
    value: number;
    timestamp: Date;
  }[];
}
