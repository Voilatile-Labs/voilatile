import "../style/globals.css";
import "@rainbow-me/rainbowkit/styles.css";

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import WalletProvider from "./_containers/wallet-provider";
import { TokenPriceProvider } from "./_containers/token-price-provider";
import { Toaster } from "@/components/ui/toaster";
import InitialStateProvider from "./_containers/initial-state";

const inter = Inter({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Voilatile",
};

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>
        <WalletProvider>
          <InitialStateProvider>
            {/* <TokenPriceProvider> */}
            {children}
            {/* </TokenPriceProvider> */}
          </InitialStateProvider>
          <Toaster />
        </WalletProvider>
      </body>
    </html>
  );
};

export default Layout;
