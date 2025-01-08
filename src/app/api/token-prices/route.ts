import { NextResponse } from "next/server";
import axios from "axios";
import { data as Tokens } from "@/constants/token";

export async function GET() {
  try {
    const ids = Tokens.map((token) => token.searchId).join(",");
    const { data } = await axios.get(
      `https://pro-api.coinmarketcap.com/v2/cryptocurrency/quotes/latest?id=${ids}`,
      {
        headers: {
          "X-CMC_PRO_API_KEY": process.env.COINMARKETCAP_API_KEY,
        },
      }
    );

    const priceMap: Record<string, number> = {};
    for (const token of Tokens) {
      priceMap[token.searchId] = data.data[token.searchId].quote.USD.price;
    }

    return NextResponse.json(priceMap);
  } catch (error) {
    console.log("Failed:", error);
    return NextResponse.json(
      { error: "Failed to fetch current token prices." },
      { status: 500 }
    );
  }
}
