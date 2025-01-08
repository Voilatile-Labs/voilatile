"use client";

import { useEffect } from "react";
import { usePeripheryContract } from "../_hooks/usePeripheryContract";
import useLongPositionStore from "@/stores/global/long-position-store";
import useLiquidityPositionStore from "@/stores/global/liquidity-position-store";
import useShortPositionStore from "@/stores/global/short-position-store";

interface InitialStateProviderProps {
  children: React.ReactNode;
}

const InitialStateProvider = ({ children }: InitialStateProviderProps) => {
  const { setFee: setLongFee, setTick: setLongTick } = useLongPositionStore();
  const {
    setFee: setLiquidityFee,
    setStartTick: setLiquidityStartTick,
    setEndTick: setLiquidityEndTick,
  } = useLiquidityPositionStore();

  const { setFee: setShortFee, setTick: setShortTick } =
    useShortPositionStore();

  const { feeTier, atm } = usePeripheryContract(
    process.env.NEXT_PUBLIC_VOILATILE_CONTRACT_ADDRESS as string
  );

  useEffect(() => {
    if (feeTier) {
      setLongFee(Number(feeTier));
      setLiquidityFee(Number(feeTier));
      setShortFee(Number(feeTier));
    }
  }, [feeTier, setLongFee, setLiquidityFee, setShortFee]);

  useEffect(() => {
    if (atm) {
      setLongTick(atm);
      setLiquidityStartTick(atm - 500);
      setLiquidityEndTick(atm + 500);
      setShortTick(atm);
    }
  }, [
    atm,
    setLongTick,
    setLiquidityStartTick,
    setLiquidityEndTick,
    setShortTick,
  ]);

  return <>{children}</>;
};

export default InitialStateProvider;
