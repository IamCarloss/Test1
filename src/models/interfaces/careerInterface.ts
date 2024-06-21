interface ICareer {
  _id: string;
  name: string;
  careerCode: string;
  academicLevel:
    | "primaria"
    | "secundaria"
    | "bachillerato"
    | "universidad"
    | "posgrado"
    | "nocturna"
    | "virtual"
    | "taller";
  active: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
