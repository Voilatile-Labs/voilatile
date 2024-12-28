import { create } from "zustand";

import { Token } from "@/constants/token";

interface GlobalStore {
  step: "select-token" | "open-position";
  setStep: (step: "select-token" | "open-position") => void;

  longToken: Token | null;
  setLongToken: (longToken: Token | null) => void;

  longTokenAmount: string;
  setLongTokenAmount: (longTokenAmount: string) => void;

  shortToken: Token | null;
  setShortToken: (shortToken: Token | null) => void;

  shortTokenAmount: string;
  setShortTokenAmount: (shortTokenAmount: string) => void;

  strikePrice: number;
  setStrikePrice: (strikePrice: number) => void;

  fee: number;
  setFee: (fee: number) => void;

  tokenPriceMap: { data: Record<string, number>; updatedAt: Date };
  setTokenPriceMap: (tokenPriceMap: {
    data: Record<string, number>;
    updatedAt: Date;
  }) => void;

  positionType: "long" | "short" | "liquidity";
  setPositionType: (positionType: "long" | "short" | "liquidity") => void;

  sortBy: "createdAt" | "expiryDate" | "fundingFee";
  setSortBy: (sortBy: "createdAt" | "expiryDate" | "fundingFee") => void;
}

const useGlobalStore = create<GlobalStore>((set) => ({
  step: "select-token",
  setStep: (step: "select-token" | "open-position") => set({ step }),

  longToken: null,
  setLongToken: (longToken: Token | null) => set({ longToken }),

  shortToken: null,
  setShortToken: (shortToken: Token | null) => set({ shortToken }),

  longTokenAmount: "",
  setLongTokenAmount: (longTokenAmount: string) => set({ longTokenAmount }),

  shortTokenAmount: "",
  setShortTokenAmount: (shortTokenAmount: string) => set({ shortTokenAmount }),

  strikePrice: 0,
  setStrikePrice: (strikePrice: number) => set({ strikePrice }),

  fee: 0,
  setFee: (fee: number) => set({ fee }),

  tokenPriceMap: { data: {}, updatedAt: new Date() },
  setTokenPriceMap: (tokenPriceMap: {
    data: Record<string, number>;
    updatedAt: Date;
  }) => set({ tokenPriceMap }),

  positionType: "long",
  setPositionType: (positionType: "long" | "short" | "liquidity") =>
    set({ positionType }),

  sortBy: "createdAt",
  setSortBy: (sortBy: "createdAt" | "expiryDate" | "fundingFee") =>
    set({ sortBy }),
}));

export default useGlobalStore;
