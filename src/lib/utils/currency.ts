/**
 * Format a number as Indian Rupees with appropriate unit (Lakh/Crore)
 */
export function formatIndianCurrency(value: number): string {
  if (value === 0) {
    return "₹0";
  }

  const absValue = Math.abs(value);
  const sign = value < 0 ? "-" : "";

  // Convert to Crores (1 Crore = 10,000,000)
  if (absValue >= 10000000) {
    const crores = absValue / 10000000;
    return `${sign}₹${crores.toFixed(1)}Cr`;
  }

  // Convert to Lakhs (1 Lakh = 100,000)
  if (absValue >= 100000) {
    const lakhs = absValue / 100000;
    return `${sign}₹${lakhs.toFixed(1)}L`;
  }

  // Convert to Thousands
  if (absValue >= 1000) {
    const thousands = absValue / 1000;
    return `${sign}₹${thousands.toFixed(0)}K`;
  }

  // Less than 1000
  return `${sign}₹${absValue.toFixed(0)}`;
}

/**
 * Format a number as full Indian Rupees with commas (Indian numbering system)
 */
export function formatIndianCurrencyFull(value: number): string {
  if (value === 0) {
    return "₹0";
  }

  // Indian numbering system: XX,XX,XXX
  const formatter = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  });

  return formatter.format(value);
}
