export const formatePercentage = (value: number): string => {
  return Intl.NumberFormat("en-US", {
    notation: "compact",
    style: "percent",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(value / 100);
};

export const formatNumberWithDecimals = (
  value: number,
  decimals = 2
): string => {
  return Intl.NumberFormat("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: decimals,
  }).format(value);
};
