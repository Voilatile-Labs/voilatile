"use client";

import { createContext, useContext, useEffect } from "react";
import axios from "axios";
import { data as Tokens } from "@/constants/token";
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
      const ids = Tokens.map((token) => token.searchId).join(",");
      console.log({
        ids,
        apiKey: process.env.NEXT_PUBLIC_COINMARKETCAP_API_KEY,
      });
      const { data } = await axios.get(
        `https://pro-api.coinmarketcap.com/v2/cryptocurrency/quotes/latest?id=${ids}`,
        {
          headers: {
            "X-CMC_PRO_API_KEY": process.env.NEXT_PUBLIC_COINMARKETCAP_API_KEY,
          },
        }
      );

      const priceMap: Record<string, number> = {};
      for (const token of Tokens) {
        priceMap[token.searchId] = data.data[token.searchId].quote.USD.price;
      }
      return priceMap;
    },
  });

  useEffect(() => {
    if (data) {
      setTokenPriceMap({
        data,
        updatedAt: new Date(),
      });
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
