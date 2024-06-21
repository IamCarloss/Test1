export interface ISubject {
  _id: string;
  name: string;
  key: string;
  shortName?: string;
  methodology?: string;
  description?: string;
  period: number;
  scheduledHours: number;
  credits?: number;
  expertise?: string;
  formula?: string;
  active?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
