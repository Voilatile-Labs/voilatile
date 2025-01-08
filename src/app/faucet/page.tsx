"use client";

import { Button } from "@/components/ui/button";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";
import axios from "axios";
import Page from "../_components/common/page";
import { defaultShortToken, defaultLongToken } from "@/constants/token";
import Image from "next/image";

const Faucet = () => {
  const { openConnectModal } = useConnectModal();
  const { address } = useAccount();

  const [isLoading, setIsLoading] = useState(false);

  const handleTokenFaucet = async () => {
    if (!address) return;

    setIsLoading(true);
    try {
      await axios.post("/api/transfer-tokens", { address });

      toast({
        title: "Success",
        description: `${defaultLongToken.symbol} and ${defaultShortToken.symbol} have been transferred to your wallet.`,
      });
    } catch (error) {
      toast({
        title: "Failed to Get Tokens",
        description:
          "You may already have tokens in your wallet. Each wallet can only request tokens once.",
      });
      console.log("Failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Page>
      <div className="flex flex-col justify-center items-center p-4 py-8">
        <div className="max-w-lg w-full">
          <div className="rounded-2xl bg-white shadow-sm p-4 max-w-lg w-full border flex flex-col gap-4">
            <div className="flex items-center justify-center gap-4 mb-4 relative">
              <h2 className="text-lg font-semibold">Testnet Faucet</h2>
            </div>

            <p className="text-sm text-gray-500 text-center">
              Get testnet tokens to try out the Volatile platform.
            </p>

            <p className="text-sm text-gray-500 text-center">
              These tokens are for testing purposes only and have no real value.
              You can only request 1 vETH and 5,000 vUSDC once.
            </p>

            <div className="flex flex-col gap-4 mt-4">
              <div className="flex items-center gap-3 bg-gray-50 rounded-xl p-4">
                <Image
                  src={defaultLongToken.image}
                  alt={defaultLongToken.name}
                  width={28}
                  height={28}
                  className="rounded-full"
                />
                <div className="flex flex-col items-start">
                  <span className="font-medium text-gray-900">0.02 SETH</span>
                  <span className="text-sm text-gray-500">
                    Sepolia Ethereum
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3 bg-gray-50 rounded-xl p-4">
                <Image
                  src={defaultLongToken.image}
                  alt={defaultLongToken.name}
                  width={28}
                  height={28}
                  className="rounded-full"
                />
                <div className="flex flex-col items-start">
                  <span className="font-medium text-gray-900">
                    1 {defaultLongToken.symbol}
                  </span>
                  <span className="text-sm text-gray-500">
                    {defaultLongToken.name}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3 bg-gray-50 rounded-xl p-4">
                <Image
                  src={defaultShortToken.image}
                  alt={defaultShortToken.name}
                  width={28}
                  height={28}
                  className="rounded-full"
                />
                <div className="flex flex-col items-start">
                  <span className="font-medium text-gray-900">
                    5,000 {defaultShortToken.symbol}
                  </span>
                  <span className="text-sm text-gray-500">
                    {defaultShortToken.name}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {address ? (
            <Button
              onClick={handleTokenFaucet}
              className="rounded-2xl w-full mt-4 h-12 text-base"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
              ) : (
                "Get Tokens"
              )}
            </Button>
          ) : (
            <Button
              onClick={openConnectModal}
              className="rounded-2xl w-full mt-4 h-12 text-base"
            >
              Connect
            </Button>
          )}
        </div>
      </div>
    </Page>
  );
};

export default Faucet;
