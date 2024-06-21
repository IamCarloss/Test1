export interface IProfessor {
  _id: string;
  name: string;
  rfc?: string;
  classification: "a" | "b" | "c" | "d" | "i";
  active?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
