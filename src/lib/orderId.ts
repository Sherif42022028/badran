/**
 * Generates a unique order ID string.
 * Format: [PREFIX]-[YYYYMMDD]-[XXXX]
 * Example: BD-20260809-4821
 */
export function generateOrderId(prefix = "BD"): string {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const random4 = Math.floor(1000 + Math.random() * 9000).toString();

  return `${prefix}-${year}${month}${day}-${random4}`;
}
