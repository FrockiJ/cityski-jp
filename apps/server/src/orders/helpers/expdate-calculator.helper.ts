/**
 * Calculate expiration date for an order based on the first lesson date and plan number
 *
 * Business Rules:
 * - planNumber <= 10: expDate = firstLessonDate + 6 months
 * - planNumber > 10: expDate = firstLessonDate + 1 year
 * - No first lesson: return null
 *
 * @param firstLessonDate - Date of the first scheduled lesson
 * @param planNumber - Number of lessons in the order
 * @returns Calculated expiration date or null if no first lesson
 */
export function calculateExpDate(
  firstLessonDate: Date | null,
  planNumber: number,
): Date | null {
  if (!firstLessonDate) {
    return null;
  }

  const expDate = new Date(firstLessonDate);

  if (planNumber <= 10) {
    // Add 6 months for orders with 10 lessons or less
    expDate.setMonth(expDate.getMonth() + 6);
  } else {
    // Add 1 year for orders with more than 10 lessons
    expDate.setFullYear(expDate.getFullYear() + 1);
  }

  return expDate;
}
