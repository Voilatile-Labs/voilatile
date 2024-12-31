"use client";

import { useMemo, useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import useGlobalStore from "@/stores/global/global-store";
import { CategoricalChartState } from "recharts/types/chart/types";
import { formatNumberWithDecimals, formatePercentage } from "@/utils/number";
import { usePeripheryContract } from "@/app/_hooks/usePeripheryContract";
import { TICK_SPACE, tickToPrice, tickToProfit } from "@/utils/currency";
import { priceToTick } from "@/utils/currency";
import BigNumber from "bignumber.js";

const SelectStrikePrice = () => {
  const { longToken, tick, setTick } = useGlobalStore();
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

    const start =
      Math.floor(priceToTick(tickToPrice(atm) - 0.05) / TICK_SPACE) *
      TICK_SPACE;

    const end =
      Math.ceil(priceToTick(tickToPrice(atm) + 0.05) / TICK_SPACE) * TICK_SPACE;

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

      if (!atmPrice || !tickPrices) return;

      const data = ticks.map((x, i) => ({
        tick: x,
        price: (tickPrices[i] * tickToPrice(x)) / tickToPrice(atm + tick - x),
        profit: tickPrices[i] - (atmPrice / atmPrice) * 100,
      }));

      setChartData(data);
    };

    fetchChartData();
  }, [tick, atm, getCalculatedLongPrices, tickData]);

  const handleTickChange = (value: number) => {
    setTick(tick + value);
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

      <div className="flex gap-4 items-center">
        <div className="w-24 text-sm">{tickToProfit(tick).toFixed(2)}%</div>
        <div className="flex-1">
          <input
            type="range"
            min={tickData?.[0]?.toString() || "0"}
            max={tickData?.[tickData.length - 1]?.toString() || "100"}
            value={tick.toString()}
            onChange={(e) => setTick(BigNumber(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
        </div>
      </div>

      <div className="mt-4 h-[300px] border p-2 rounded-xl">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chartData}
            margin={{ bottom: 10 }}
            onClick={handleChartClick}
          >
            <XAxis
              dataKey="spotPrice"
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
              type="monotone"
              dataKey="profit"
              stroke="rgb(75, 192, 192)"
              dot={false}
            />

            <Line
              type="monotone"
              dataKey="selectedProfit"
              stroke="rgb(255, 99, 132)"
              strokeDasharray="5 5"
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default SelectStrikePrice;
