"use client";

import { Plus, Minus } from "lucide-react";
import { useState } from "react";
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

const SelectStrikePrice = () => {
  const { longToken } = useGlobalStore();

  const [tickValue, setTickValue] = useState(0);

  const calculateProfit = (tick: number) => {
    const value = Math.pow(1.0001, tick);
    return ((value - 1) * 100).toFixed(2);
  };

  const predefinedTicks = [-1000, 0, 1000];

  const points = 5000;
  const startTick = tickValue - 10000;
  const endTick = tickValue + 10000;

  const chartData = Array.from({ length: points }, (_, i) => {
    const tick = Math.round(
      startTick + (i * (endTick - startTick)) / (points - 1)
    );
    const value = Math.pow(1.0001, tick);
    return {
      tick: tick,
      value: Number(((value - 1) * 100).toFixed(2)),
      selectedValue: Number(calculateProfit(tickValue)),
    };
  });

  const handleIncrement = () => {
    setTickValue(tickValue + 1);
  };

  const handleDecrement = () => {
    setTickValue(tickValue - 1);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === "") {
      setTickValue(0);
      return;
    }
    const numValue = Math.round(Number(value));
    if (!isNaN(numValue)) {
      setTickValue(numValue);
    }
  };

  const handleChartClick = (data: CategoricalChartState) => {
    if (data && data.activePayload && data.activePayload[0]) {
      setTickValue(data.activePayload[0].payload.tick);
    }
  };

  return (
    <div className="w-full">
      <h3 className="text-xs font-medium mb-2">Select Tick Value</h3>

      <div className="flex gap-2 items-center">
        <div className="flex-1">
          <Input
            type="number"
            value={tickValue}
            onChange={handleInputChange}
            className="w-full rounded-xl"
            step="1"
          />
        </div>
        <div className="flex gap-1">
          <Button
            variant="outline"
            size="icon"
            onClick={handleDecrement}
            className="h-10 w-10 rounded-xl"
          >
            <Minus className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={handleIncrement}
            className="h-10 w-10 rounded-xl"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="text-xs text-gray-500 mt-1">
        Profit: {calculateProfit(tickValue)}%
      </div>

      <div className="flex gap-2 mt-2">
        {predefinedTicks.map((tick) => (
          <Button
            key={tick}
            variant="outline"
            size="sm"
            onClick={() => setTickValue(tick)}
            className={`flex-1 ${tickValue === tick ? "bg-gray-100" : ""}`}
          >
            {calculateProfit(tick)}%
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
              dataKey="tick"
              label={{
                value: longToken
                  ? longToken.symbol + " Spot Price"
                  : "Spot Price",
                position: "bottom",
                fontSize: 12,
                offset: -16,
              }}
              domain={["auto", "auto"]}
              tick={false}
            />

            <YAxis
              label={{
                value: "PnL",
                angle: -90,
                position: "insideLeft",
                fontSize: 12,
              }}
              domain={["auto", "auto"]}
              tick={{ fontSize: 11 }}
              tickFormatter={(tick) =>
                Intl.NumberFormat("en-US", {
                  notation: "compact",
                  style: "percent",
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 2,
                }).format(tick / 100)
              }
            />
            <Tooltip
              contentStyle={{ fontSize: "12px", padding: "4px 8px" }}
              formatter={(value: number, name: string) => [
                `${value.toFixed(2)}%`,
                name === "value" ? "Profit" : "Selected Profit",
              ]}
              labelFormatter={(tick) => `Tick: ${tick}`}
            />

            <Line
              type="monotone"
              dataKey="value"
              stroke="rgb(75, 192, 192)"
              dot={false}
            />

            <Line
              type="monotone"
              dataKey="selectedValue"
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
