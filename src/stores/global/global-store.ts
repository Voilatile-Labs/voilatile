import { create } from "zustand";

export enum Position {
  Liquidity = "liquidity",
  Long = "long",
  Short = "short",
}

const initialGlobalStoreState = {
  positionType: Position.Long,

  tokenPriceMap: {},
};

interface GlobalStore {
  positionType: Position;
  setPositionType: (option: Position) => void;

  tokenPriceMap: Record<string, number>;
  setTokenPriceMap: (tokenPriceMap: Record<string, number>) => void;
}

const useGlobalStore = create<GlobalStore>((set) => ({
  positionType: initialGlobalStoreState.positionType,
  setPositionType: (option: Position) => set({ positionType: option }),

  tokenPriceMap: initialGlobalStoreState.tokenPriceMap,
  setTokenPriceMap: (tokenPriceMap: Record<string, number>) =>
    set({ tokenPriceMap }),
}));

export default useGlobalStore;
