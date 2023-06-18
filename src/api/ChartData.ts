import { DeviceValues } from "./Device";

export interface ChartDataProps {
  id?: string;
  values: DeviceValues[];
  historyData?: {
    argument: string;
    value: number;
  }[];
}
