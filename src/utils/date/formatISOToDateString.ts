/**
 * Convierte una fecha en formato ISO a una fecha en formato de cadena de texto (dd/mm/yyyy)
 * @param isoDate Fecha en formato ISO
 * @returns Fecha en formato de cadena de texto (dd/mm/yyyy)
 */

export function formatISOToDateString(isoDate: string) {
  const date = isoDate.split("T")[0];

  const [year, month, day] = date.split("-");

  return `${day}/${month}/${year}`;
}
