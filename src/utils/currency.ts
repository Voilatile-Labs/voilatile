import { formatUnits, parseUnits } from "viem";

export const TICK_BASE = 1.0001;
export const TICK_SPACE = 20;

export const tickToPrice = (tick: number): number => {
  return TICK_BASE ** tick;
};

export const priceToTick = (price: number): number => {
  const tick = Math.log(price) / Math.log(TICK_BASE);
  return Math.ceil(tick / TICK_SPACE) * TICK_SPACE;
};

export const tickToProfit = (tick: number, atm: number): number => {
  return ((tickToPrice(tick) - tickToPrice(atm)) / tickToPrice(atm)) * 100;
};

export const tokenAmountToDecimal = (
  amount: number,
  decimals: number = 18
): number => {
  return Number(formatUnits(BigInt(amount), decimals));
};

export const decimalToTokenAmount = (
  amount: number,
  decimals: number = 18
): number => {
  return Number(parseUnits(amount.toString(), decimals));
};
