"use client";

import { useEffect } from "react";
import useGlobalStore from "@/stores/global/global-store";
import { usePeripheryContract } from "../_hooks/usePeripheryContract";

interface InitialStateProviderProps {
  children: React.ReactNode;
}

const InitialStateProvider = ({ children }: InitialStateProviderProps) => {
  const { setFee, setTick } = useGlobalStore();

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
