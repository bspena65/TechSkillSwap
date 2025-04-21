import { DateTime } from "luxon";

export const formatDate = (date: Date | string | undefined): string => {
  if (!date) return "";  // Verifica si la fecha es nula o indefinida.
  return DateTime.fromISO(new Date(date).toISOString()).toFormat('yyyy-MM-dd');
};
