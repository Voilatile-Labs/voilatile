"use client";

import { useEffect } from "react";
import { usePeripheryContract } from "../_hooks/usePeripheryContract";
import useLongPositionStore from "@/stores/global/long-position-store";

interface InitialStateProviderProps {
  children: React.ReactNode;
}

const InitialStateProvider = ({ children }: InitialStateProviderProps) => {
  const { setFee, setTick } = useLongPositionStore();

  const { feeTier, atm } = usePeripheryContract(
    process.env.NEXT_PUBLIC_VOILATILE_CONTRACT_ADDRESS as string
  );

  useEffect(() => {
    if (feeTier) {
      setFee(Number(feeTier));
    }
  }, [feeTier, setFee]);

  useEffect(() => {
    if (atm) {
      setTick(atm);
    }
  }, [atm, setTick]);

  return <>{children}</>;
};

export default InitialStateProvider;
