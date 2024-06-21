import { ISubject } from "./subjectInterface";

export interface IStudyPlan {
  _id: string;
  careerId: string | ICareer;
  name: string;
  code: string;
  periodDenomination: string;
  subjects?: string[] | ISubject[];
  active: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
