import { DateTime } from "luxon";

// Función para validar y formatear la fecha con arrow functions
export const formatDateInSpanish = (dateString: string): string => {
  // Crear un objeto DateTime de Luxon desde la cadena
  const date = DateTime.fromISO(dateString);

  // Verificar si la fecha es válida
  if (!date.isValid) {
    return "FECHA NO VÁLIDA"; // Retorna "FECHA NO VÁLIDA" si la fecha no es válida
  }

  // Configuración del idioma español para la salida y formateo de la fecha
  let formattedDate = date.setLocale("es").toFormat("MMMM d 'del' yyyy");

  // Capitalizar la primera letra del mes
  formattedDate =
    formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);

  // Retorna la fecha formateada con la primera letra capitalizada
  return formattedDate;
};
