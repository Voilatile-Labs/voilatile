"use client";

import { useMemo, useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  ReferenceDot,
  ReferenceLine,
} from "recharts";
import useGlobalStore from "@/stores/global/global-store";
import { CategoricalChartState } from "recharts/types/chart/types";
import { formatNumberWithDecimals, formatePercentage } from "@/utils/number";
import { usePeripheryContract } from "@/app/_hooks/usePeripheryContract";
import {
  decimalToTokenAmount,
  TICK_SPACE,
  tickToPrice,
  tickToProfit,
  tokenAmountToDecimal,
} from "@/utils/currency";
import { priceToTick } from "@/utils/currency";
import { Slider } from "@/components/ui/slider";

const SelectStrikePrice = () => {
  const {
    longToken,
    tick,
    setTick,
    shortToken,
    longTokenAmount,
    setShortTokenAmount,
  } = useGlobalStore();

  const { atm, getCalculatedLongPrices } = usePeripheryContract(
    process.env.NEXT_PUBLIC_VOILATILE_CONTRACT_ADDRESS as string
  );

  const [chartData, setChartData] = useState<
    Array<{
      tick: number;
      price: number;
      profit: number;
    }>
  >([]);

  const tickData = useMemo(() => {
    if (!atm) {
      return [];
    }
    // const atmPrice = tickToPrice(atm);
    // const start =
    //   Math.floor(priceToTick(atmPrice - 0.05 * atmPrice) / TICK_SPACE) *
    //   TICK_SPACE;
    // const end =
    //   Math.ceil(priceToTick(atmPrice + 0.05 * atmPrice) / TICK_SPACE) *
    //   TICK_SPACE;

    const start = Math.floor((atm - 500) / TICK_SPACE) * TICK_SPACE;
    const end = Math.ceil((atm + 500) / TICK_SPACE) * TICK_SPACE;

    const ticks = Array.from(
      { length: (end - start) / TICK_SPACE + 1 },
      (_, i) => start + i * TICK_SPACE
    );

    return ticks;
  }, [atm]);

  useEffect(() => {
    const fetchChartData = async () => {
      if (!atm) return;

      const ticks = tickData.map((x) => atm + tick - x);

      const atmPrices = await getCalculatedLongPrices([atm]);
      const atmPrice = atmPrices?.[0] || null;

      const tickPrices = await getCalculatedLongPrices(ticks);

      if (!atmPrice || !tickPrices) {
        return [];
      }

      const data = tickData.map((x, i) => ({
        tick: x,
        price: (tickPrices[i] * tickToPrice(x)) / tickToPrice(atm + tick - x),
        profit: ((tickPrices[i] - atmPrice) / atmPrice) * 100,
      }));

      setChartData(data);
    };

    fetchChartData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tickData, tick, atm]);

  const handleTickChange = async (value: number) => {
    setTick(value);
    const prices = await getCalculatedLongPrices([tick]);

    if (prices) {
      const shortRawAmount = longTokenAmount.rawAmount * prices[0];

      setShortTokenAmount({
        amount: tokenAmountToDecimal(
          parseInt(shortRawAmount.toString()),
          shortToken?.decimals
        ).toString(),
        rawAmount: decimalToTokenAmount(shortRawAmount, shortToken?.decimals),
      });
    }
  };

  const handleChartClick = (data: CategoricalChartState) => {
    if (data && data.activePayload && data.activePayload[0]) {
      const price = data.activePayload[0].payload.spotPrice;
      const value = priceToTick(price);
      setTick(value);
    }
  };

  const XAxisLabel = useMemo(() => {
    return longToken ? longToken.symbol + " Spot Price" : "Spot Price";
  }, [longToken]);

  const YAxisLabel = useMemo(() => {
    return "PnL";
  }, []);

  return (
    <div className="w-full">
      <h3 className="text-xs font-medium mb-2">Select Strike Price</h3>

      <div className="border rounded-2xl p-1 flex gap-3 items-center">
        <div className="flex justify-center text-lg font-medium border rounded-xl p-2 w-24 bg-gray-50">
          {formatePercentage(tickToProfit(tick, atm || 0))}
        </div>
        <div className="flex-1 mr-2">
          <Slider
            defaultValue={[tick]}
            min={tickData?.[0] || 0}
            max={tickData?.[tickData.length - 1] || 100}
            step={1}
            value={[tick]}
            onValueChange={([value]) => handleTickChange(value)}
            className="w-full [&_[role=slider]]:h-4 [&_[role=slider]]:w-4"
          />
        </div>
      </div>

      <div className="mt-4 h-[300px] border p-2 rounded-2xl">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chartData}
            margin={{ bottom: 10 }}
            onClick={handleChartClick}
          >
            <XAxis
              dataKey="tick"
              label={{
                value: XAxisLabel,
                position: "bottom",
                fontSize: 12,
                offset: -16,
              }}
              domain={["auto", "auto"]}
              tick={false}
            />

            <YAxis
              dataKey="profit"
              label={{
                value: YAxisLabel,
                angle: -90,
                position: "insideLeft",
                fontSize: 12,
              }}
              domain={["auto", "auto"]}
              tick={{ fontSize: 11 }}
              tickFormatter={(profit) => formatePercentage(profit)}
            />

            <Tooltip
              contentStyle={{ fontSize: "12px", padding: "4px 8px" }}
              formatter={(value: number, name: string) => [
                formatePercentage(value),
                name === "profit" ? "Profit" : "Selected Profit",
              ]}
              labelFormatter={(spotPrice) =>
                `Spot Price: ${formatNumberWithDecimals(spotPrice)}x`
              }
            />

            <Line
              type="natural"
              dataKey="profit"
              stroke="rgb(75, 192, 192)"
              dot={false}
            />

            <ReferenceDot
              x={atm}
              y={chartData.find((x) => x.tick === atm)?.profit || 0}
              r={4}
              fill="rgb(75, 192, 192)"
              stroke="none"
            />

            <ReferenceLine
              x={atm}
              stroke="rgb(75, 192, 192)"
              strokeDasharray="3 3"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default SelectStrikePrice;
