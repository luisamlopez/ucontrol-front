import { DeviceValues } from "./Device";

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
    argument: string;
    valueT: number;
    valueH: number;
    timestamp: string;
  }[];
}
