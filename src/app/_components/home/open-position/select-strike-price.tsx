"use client";

import { Plus, Minus } from "lucide-react";
import { useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { formateNumber, formatePercentage } from "@/utils/number";
import { calculateTokenTick } from "@/utils/currency";

const TICK_BASE = 1.0001;

export const tickToPrice = (tick: number): number => {
  return Math.pow(TICK_BASE, tick);
};

export const priceToTick = (price: number): number => {
  return Math.ceil(Math.log(price) / Math.log(TICK_BASE));
};

export const tickToProfit = (tick: number) => {
  const value = Math.pow(TICK_BASE, tick);
  return (value - 1) * 100;
};

const SelectStrikePrice = () => {
  const { longToken, shortToken, tick, setTick, tokenPriceMap } =
    useGlobalStore();

  useEffect(() => {
    if (tokenPriceMap && longToken && shortToken) {
      const value = calculateTokenTick(tokenPriceMap, longToken, shortToken);
      setTick(value);
    }
  }, [longToken, shortToken, tokenPriceMap, setTick]);

  const predefinedTicks = useMemo(
    () => [tick - 1000, tick, tick + 1000],
    [tick]
  );

  const points = 5000;
  const start = tick - 10000;
  const end = tick + 10000;
  const chartData = Array.from({ length: points }, (_, i) => {
    const t = Math.round(start + (i * (end - start)) / (points - 1));
    return {
      spotPrice: tickToPrice(t),
      profit: tickToProfit(t),
      selectedProfit: tickToProfit(tick),
    };
  });

  const handleTickChange = (value: number) => {
    setTick(tick + value);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === "") {
      setTick(0);
      return;
    }
    const numValue = Math.round(Number(value));
    if (!isNaN(numValue)) {
      setTick(numValue);
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

      <div className="flex gap-2 items-center">
        <div className="flex-1">
          <Input
            type="number"
            value={tick}
            onChange={handleInputChange}
            className="w-full rounded-xl"
            step="1"
          />
        </div>

        <div className="flex gap-1">
          <Button
            variant="outline"
            size="icon"
            onClick={() => handleTickChange(-1)}
            className="h-10 w-10 rounded-xl"
          >
            <Minus className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => handleTickChange(1)}
            className="h-10 w-10 rounded-xl"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="text-xs text-gray-500 mt-1">
        Profit: {tickToProfit(tick)}%
      </div>

      <div className="flex gap-2 mt-2">
        {predefinedTicks.map((t) => (
          <Button
            key={t}
            variant="outline"
            size="sm"
            onClick={() => setTick(t)}
            className={`flex-1 ${t === tick ? "bg-gray-100" : ""}`}
          >
            {formatePercentage(tickToProfit(t))}
          </Button>
        ))}
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
                `Spot Price: ${formateNumber(spotPrice)}x`
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
