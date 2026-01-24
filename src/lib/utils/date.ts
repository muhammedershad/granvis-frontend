/**
 * Converts a Date object to UTC date string (YYYY-MM-DD format)
 * This ensures dates are stored consistently in UTC without timezone shifts
 *
 * Example:
 * - User in India (UTC+5:30) selects "January 24, 2024"
 * - Without this function: Could become "2024-01-23" due to timezone conversion
 * - With this function: Always becomes "2024-01-24" regardless of timezone
 *
 * @param date - The date to convert, or undefined
 * @returns UTC date string in YYYY-MM-DD format, or empty string if date is undefined
 */
export const dateToUTC = (date: Date | undefined): string => {
  if (!date) {
    return "";
  }

  // Create a new Date in UTC using the local date's year, month, and day
  // This prevents timezone shifts when converting to ISO string
  const utcDate = new Date(
    Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())
  );

  // Extract just the date part (YYYY-MM-DD) from the ISO string
  return utcDate.toISOString().split("T")[0];
};

/**
 * Converts a UTC date string (YYYY-MM-DD) to a Date object
 * Useful when reading dates from the backend
 *
 * @param dateString - UTC date string in YYYY-MM-DD format
 * @returns Date object or undefined if dateString is empty
 */
export const utcToDate = (dateString: string | undefined): Date | undefined => {
  if (!dateString) {
    return undefined;
  }

  // Parse the date parts to avoid timezone issues
  const [year, month, day] = dateString.split("-").map(Number);
  return new Date(year, month - 1, day);
};
