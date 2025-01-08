import { create } from "zustand";
import { data as Tokens, Token } from "@/constants/token";
import { data as FeeTiers } from "@/constants/fee";

const initialState = {
  longToken: Tokens[0],
  longTokenAmount: {
    amount: "",
    rawAmount: 0,
  },

  shortToken: Tokens[1],
  shortTokenAmount: {
    amount: "",
    rawAmount: 0,
  },

  startTick: 0,
  endTick: 0,

  fee: FeeTiers[1].fee,
};

interface LiquidityPositionStore {
  longToken: Token | undefined;
  setLongToken: (token: Token | undefined) => void;

  longTokenAmount: {
    amount: string;
    rawAmount: number;
  };
  setLongTokenAmount: (amount: { amount: string; rawAmount: number }) => void;

  shortToken: Token | undefined;
  setShortToken: (token: Token | undefined) => void;

  shortTokenAmount: {
    amount: string;
    rawAmount: number;
  };
  setShortTokenAmount: (amount: { amount: string; rawAmount: number }) => void;

  startTick: number;
  setStartTick: (tick: number) => void;

  endTick: number;
  setEndTick: (tick: number) => void;

  fee: number;
  setFee: (fee: number) => void;

  reset: () => void;
}

const useLiquidityPositionStore = create<LiquidityPositionStore>((set) => ({
  longToken: initialState.longToken,
  setLongToken: (token) => set({ longToken: token }),

  longTokenAmount: initialState.longTokenAmount,
  setLongTokenAmount: (amount) => set({ longTokenAmount: amount }),

  shortToken: initialState.shortToken,
  setShortToken: (token) => set({ shortToken: token }),

  shortTokenAmount: initialState.shortTokenAmount,
  setShortTokenAmount: (amount) => set({ shortTokenAmount: amount }),

  startTick: initialState.startTick,
  setStartTick: (tick) => set({ startTick: tick }),

  endTick: initialState.endTick,
  setEndTick: (tick) => set({ endTick: tick }),

  fee: initialState.fee,
  setFee: (fee) => set({ fee }),

  reset: () => set(initialState),
}));

export default useLiquidityPositionStore;
