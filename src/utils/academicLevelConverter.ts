/**
 * Convertir el nivel académico que se guarda en DB a un formato más legible.
 * @param academicLevel - Nivel académico a convertir.
 * @returns - Nivel académico en formato legible.
 */

export function academicLevelConverter(
  academicLevel:
    | "primaria"
    | "secundaria"
    | "bachillerato"
    | "universidad"
    | "posgrado"
    | "nocturna"
    | "virtual"
    | "taller"
) {
  switch (academicLevel) {
    case "primaria":
      return "Primaria";
    case "secundaria":
      return "Secundaria";
    case "bachillerato":
      return "Bachillerato";
    case "universidad":
      return "Universidad Matutina/Vespertina";
    case "posgrado":
      return "Posgrado";
    case "nocturna":
      return "Universidad Nocturna";
    case "virtual":
      return "Universidad Virtual";
    case "taller":
      return "Taller";
    default:
      return "No definido";
  }
}
