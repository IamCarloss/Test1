/**
 * Funcion que recibe un numero y devuelve el string correspondiente.
 * @param number - Numero a convertir.
 * @returns - String correspondiente al numero. Ejemplo: "Primer".
 */

export const numberToString = (number: number): string => {
  switch (number) {
    case 1:
      return "Primer";
    case 2:
      return "Segundo";
    case 3:
      return "Tercer";
    case 4:
      return "Cuarto";
    case 5:
      return "Quinto";
    case 6:
      return "Sexto";
    case 7:
      return "Séptimo";
    case 8:
      return "Octavo";
    case 9:
      return "Noveno";
    default:
      return "No definido";
  }
};
