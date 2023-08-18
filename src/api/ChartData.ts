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
  spaceId: string;
  deviceId: string;
  values: {
    valueT: number;
    valueH: number;
    timestamp: Date;
  }[];
}

export interface HChartProps {
  spaceId: string;
  deviceId: string;
  values: {
    value: number;
    timestamp: Date;
  }[];
}
