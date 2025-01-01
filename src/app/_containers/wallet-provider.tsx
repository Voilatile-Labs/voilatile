"use client";

import { Config, WagmiProvider } from "wagmi";
import { sepolia } from "wagmi/chains";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { getDefaultConfig, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { fallback, http } from "wagmi";

interface WalletProviderProps {
  children: React.ReactNode;
}

export const config = getDefaultConfig({
  appName: "Voilatile",
  projectId: process.env.NEXT_PUBLIC_WEB3_PROJECT_ID as string,
  chains: [sepolia],
  ssr: true,
  transports: {
    [sepolia.id]: fallback([
      http(process.env.NEXT_PUBLIC_SEPOLIA_RPC_URL as string),
      http(),
    ]),
  },
});

const WalletProvider = ({ children }: WalletProviderProps) => {
  const queryClient = new QueryClient();

  return (
    <WagmiProvider config={config as Config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          <>{children}</>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
};

export default WalletProvider;
