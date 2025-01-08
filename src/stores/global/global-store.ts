import { create } from "zustand";

export enum Position {
  Liquidity = "liquidity",
  Long = "long",
  Short = "short",
}

const initialGlobalStoreState = {
  createPosition: Position.Liquidity,

  managePosition: Position.Long,

  tokenPriceMap: {},
};

interface GlobalStore {
  createPosition: Position;
  setCreatePosition: (option: Position) => void;

  managePosition: Position;
  setManagePosition: (option: Position) => void;

  tokenPriceMap: Record<string, number>;
  setTokenPriceMap: (tokenPriceMap: Record<string, number>) => void;
}

const useGlobalStore = create<GlobalStore>((set) => ({
  createPosition: initialGlobalStoreState.createPosition,
  setCreatePosition: (option: Position) => set({ createPosition: option }),

  managePosition: initialGlobalStoreState.managePosition,
  setManagePosition: (option: Position) => set({ managePosition: option }),

  tokenPriceMap: initialGlobalStoreState.tokenPriceMap,
  setTokenPriceMap: (tokenPriceMap: Record<string, number>) =>
    set({ tokenPriceMap }),
}));

export default useGlobalStore;
