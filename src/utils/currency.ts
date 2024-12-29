import { priceToTick } from "@/app/_components/home/open-position/select-strike-price";
import { Token } from "@/constants/token";
import { formatUnits, parseUnits } from "viem";

export const calculateTokenTick = (
  tokenPriceMap: Record<string, number>,
  longToken: Token,
  shortToken: Token
) => {
  const longTokenPrice = tokenPriceMap[longToken.searchId] || 1;
  const shortTokenPrice = tokenPriceMap[shortToken.searchId] || 1;

  const price = longTokenPrice / shortTokenPrice;
  const value = priceToTick(price);
  return value;
};

export const tokenAmountToDecimal = (
  amount: bigint,
  decimals: number = 18
): number => {
  return Number(formatUnits(amount, decimals));
};

export const decimalToTokenAmount = (
  amount: number,
  decimals: number = 18
): bigint => {
  return parseUnits(amount.toString(), decimals);
};
