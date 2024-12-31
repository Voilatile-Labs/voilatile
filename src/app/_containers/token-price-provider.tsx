"use client";

import { createContext, useContext, useEffect } from "react";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import useGlobalStore from "@/stores/global/global-store";

interface TokenPriceContextType {
  refetchTokenPrices: () => Promise<void>;
}
const TokenPriceContext = createContext<TokenPriceContextType>({
  refetchTokenPrices: async () => {},
});

interface TokenPriceProviderProps {
  children: React.ReactNode;
}

export function TokenPriceProvider({ children }: TokenPriceProviderProps) {
  const { setTokenPriceMap } = useGlobalStore();

  const { data, refetch } = useQuery({
    queryKey: ["token-prices"],
    queryFn: async () => {
      try {
        const { data } = await axios.get("/api/token-prices");
        return data;
      } catch (error) {
        // toast({
        //   title: "Error Fetching Prices",
        //   description: "Unable to retrieve current token prices.",
        // });
        throw error;
      }
    },
  });

  useEffect(() => {
    if (data) {
      setTokenPriceMap(data);
    }
  }, [data, setTokenPriceMap]);

  const refetchTokenPrices = async () => {
    await refetch();
  };

  return (
    <TokenPriceContext.Provider
      value={{
        refetchTokenPrices,
      }}
    >
      {children}
    </TokenPriceContext.Provider>
  );
}

export const useTokenPrice = () => useContext(TokenPriceContext);
