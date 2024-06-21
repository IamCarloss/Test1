export interface IClasificacion {
    _id: string;
    clasificacion: string;
    primaria: number;
    secundaria: number;
    bachillerato: number;
    universidad: number;
    posgrado: number;
    nocturna: number;
    virtual: number;
    taller: number;
    createdAt?: Date;
    updatedAt?: Date;
    [key: string]: any;
  }
  