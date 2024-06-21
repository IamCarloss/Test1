/**
 * Convierte la primera letra de cada palabra a mayúscula y el resto a minúscula.
 *
 * @param str - Cadena de texto a convertir.
 * @returns Cadena de texto convertida a titleCase.
 */

export function convertToTitleCase(str: string) {
  if (!str) {
    return "";
  }

  const words = str.split(" ");
  const titleCaseWords = words.map((word) => {
    const lowerCaseWord = word.toLowerCase();
    return lowerCaseWord.charAt(0).toUpperCase() + lowerCaseWord.slice(1);
  });

  return titleCaseWords.join(" ");
}
