export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatPercentage(value: number): string {
  return `${value.toFixed(1)}%`;
}

export function getTrendColor(
  trend: string,
  isPositive: boolean = true
): string {
  if (trend === "up") {
    return isPositive ? "text-green-600" : "text-red-600";
  }
  return isPositive ? "text-red-600" : "text-green-600";
}
