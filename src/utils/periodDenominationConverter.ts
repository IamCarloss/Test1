/**
 *  Convertir la denominación de un periodo a un formato más legible.
 * @param periodDenomination - Denominación del periodo.
 * @returns - Denominación del periodo en un formato más legible. Ejemplo: "Semestre".
 */

export const periodDenominationConverter = (
  periodDenomination: string | "semester" | "quarter" | "anual"
) => {
  switch (periodDenomination) {
    case "semester":
      return "Semestre";
    case "quarter":
      return "Cuatrimestre";
    case "anual":
      return "Año";
    default:
      return "No definido";
  }
};
