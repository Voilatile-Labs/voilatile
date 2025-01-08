import { NextResponse } from "next/server";
import { createPublicClient, http, createWalletClient, erc20Abi } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { sepolia } from "wagmi/chains";
import { defaultLongToken, defaultShortToken } from "@/constants/token";
import { decimalToTokenAmount } from "@/utils/currency";

const SEPOLIA_ETH_TRANSFER_GAS_LIMIT = 21000; // in wei

const VETH_TRANSFER_AMOUNT = 1;
const VUSDC_TRANSFER_AMOUNT = 5000;
const SETH_TRANSFER_AMOUNT = 0.02;

export async function POST(req: Request) {
  try {
    const { address } = await req.json();

    if (!address) {
      return NextResponse.json(
        { error: "Invalid wallet address" },
        { status: 400 }
      );
    }

    const publicClient = createPublicClient({
      chain: sepolia,
      transport: http(process.env.NEXT_PUBLIC_SEPOLIA_RPC_URL as string),
    });

    const gasPrice = await publicClient.getGasPrice();

    const [vethBalance, vusdcBalance, sethBalance] = await Promise.all([
      publicClient.readContract({
        address: defaultLongToken.contractAddress as `0x${string}`,
        abi: erc20Abi,
        functionName: "balanceOf",
        args: [address],
      }),
      publicClient.readContract({
        address: defaultShortToken.contractAddress as `0x${string}`,
        abi: erc20Abi,
        functionName: "balanceOf",
        args: [address],
      }),
      publicClient.getBalance({ address: address as `0x${string}` }),
    ]);

    if (vethBalance > BigInt(0) || vusdcBalance > BigInt(0)) {
      return NextResponse.json(
        { error: "Already has tokens" },
        { status: 400 }
      );
    }

    const account = privateKeyToAccount(
      process.env.WALLET_PRIVATE_KEY as `0x${string}`
    );
    const walletClient = createWalletClient({
      account,
      chain: sepolia,
      transport: http(process.env.NEXT_PUBLIC_SEPOLIA_RPC_URL as string),
    });

    const vethAmount = decimalToTokenAmount(
      VETH_TRANSFER_AMOUNT,
      defaultLongToken.decimals
    );
    await walletClient.writeContract({
      address: defaultLongToken.contractAddress as `0x${string}`,
      abi: erc20Abi,
      functionName: "transfer",
      args: [address, BigInt(vethAmount)],
    });

    const vusdcAmount = decimalToTokenAmount(
      VUSDC_TRANSFER_AMOUNT,
      defaultShortToken.decimals
    );
    await walletClient.writeContract({
      address: defaultShortToken.contractAddress as `0x${string}`,
      abi: erc20Abi,
      functionName: "transfer",
      args: [address, BigInt(vusdcAmount)],
    });

    if (sethBalance < BigInt(0.02) * BigInt(10 ** 18)) {
      const sethAmount = decimalToTokenAmount(SETH_TRANSFER_AMOUNT, 18);
      await walletClient.sendTransaction({
        to: address,
        value: BigInt(sethAmount),
        gasPrice: gasPrice,
        gas: BigInt(SEPOLIA_ETH_TRANSFER_GAS_LIMIT),
      });
    }

    return NextResponse.json({
      success: true,
      message: "Success",
    });
  } catch (error) {
    console.log("Failed:", error);
    return NextResponse.json(
      { error: "Failed", message: "Failed to transfer tokens" },
      { status: 500 }
    );
  }
}
