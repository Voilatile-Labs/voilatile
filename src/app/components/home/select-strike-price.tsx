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
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const SelectStrikePrice = () => {
  const [strikePrice, setStrikePrice] = useState(0);

  const predefinedPrices = [-3, 0.1, 3, 6];

  const points = 50;
  const findIntersectionPoint = () => {
    if (strikePrice <= 0) return 0;
    return 10 * Math.log(strikePrice);
  };

  const intersectionX = findIntersectionPoint();
  const startX = Math.max(0, intersectionX - 20);
  const endX = intersectionX + 20;

  const chartData = Array.from({ length: points }, (_, i) => {
    const x = startX + (i * (endX - startX)) / (points - 1);
    return {
      x: Number(x.toFixed(2)),
      value: Math.E ** (x / 10),
      strikePrice: strikePrice,
    };
  });

  const handleIncrement = () => {
    setStrikePrice(Number((strikePrice + 0.1).toFixed(2)));
  };

  const handleDecrement = () => {
    setStrikePrice(Number((strikePrice - 0.1).toFixed(2)));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === "") {
      setStrikePrice(0);
      return;
    }
    const numValue = Number(value);
    if (!isNaN(numValue)) {
      setStrikePrice(Number(numValue.toFixed(2)));
    }
  };

  return (
    <div className="w-full">
      <h3 className="text-md font-medium mb-2">Select strike price</h3>
      <div className="flex gap-2 items-center">
        <Input
          type="number"
          value={strikePrice}
          onChange={handleInputChange}
          className="w-full rounded-xl focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0"
          step="0.01"
        />
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
      <div className="flex gap-2 mt-2">
        {predefinedPrices.map((price) => (
          <Button
            key={price}
            variant="outline"
            size="sm"
            onClick={() => setStrikePrice(Number(price.toFixed(2)))}
            className={`flex-1 ${strikePrice === price ? "bg-gray-100" : ""}`}
          >
            {price.toFixed(2)} %
          </Button>
        ))}
      </div>

      <div className="mt-4 h-[300px] border p-1 rounded-xl">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ bottom: 30 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="x"
              label={{ value: "Price", position: "bottom", fontSize: 12 }}
              domain={["auto", "auto"]}
              tick={{ fontSize: 11 }}
              tickFormatter={(value) =>
                value.toLocaleString("en-US", {
                  notation: "compact",
                  maximumFractionDigits: 1,
                })
              }
            />
            <YAxis
              domain={["auto", "auto"]}
              tick={{ fontSize: 11 }}
              tickFormatter={(value) =>
                value.toLocaleString("en-US", {
                  notation: "compact",
                  maximumFractionDigits: 1,
                })
              }
            />
            <Tooltip
              formatter={(value) =>
                value.toLocaleString("en-US", {
                  notation: "compact",
                  maximumFractionDigits: 2,
                })
              }
            />

            <Line
              type="monotone"
              dataKey="value"
              stroke="rgb(75, 192, 192)"
              name="e^x"
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="strikePrice"
              stroke="rgb(255, 99, 132)"
              strokeDasharray="5 5"
              name="Strike Price"
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default SelectStrikePrice;
