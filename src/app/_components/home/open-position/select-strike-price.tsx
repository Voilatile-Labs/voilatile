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
import useLongPositionStore from "@/stores/global/long-position-store";
import { CategoricalChartState } from "recharts/types/chart/types";
import { formatNumberWithDecimals, formatePercentage } from "@/utils/number";
import { usePeripheryContract } from "@/app/_hooks/usePeripheryContract";
import {
  profitToTick,
  TICK_SPACE,
  tickToPrice,
  tickToProfit,
  tokenAmountToDecimal,
} from "@/utils/currency";
import { Slider } from "@/components/ui/slider";
import { toast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";

const SelectStrikePrice = () => {
  const {
    longToken,
    tick,
    setTick,
    shortToken,
    longTokenAmount,
    setShortTokenAmount,
  } = useLongPositionStore();

  const { atm, getCalculatedLongPrices, pToken, qToken } = usePeripheryContract(
    process.env.NEXT_PUBLIC_VOILATILE_CONTRACT_ADDRESS as string
  );

  const [chartData, setChartData] = useState<
    Array<{
      tick: number;
      tickPrice: number;
      profit: number;
      price: number;
    }>
  >([]);

  const tickRangeData = useMemo(() => {
    if (!atm) {
      return [];
    }

    const start = Math.floor((atm - 1000) / TICK_SPACE) * TICK_SPACE;
    const end = Math.ceil((atm + 1000) / TICK_SPACE) * TICK_SPACE;

    const ticks = Array.from(
      { length: (end - start) / TICK_SPACE + 1 },
      (_, i) => start + i * TICK_SPACE
    );

    return ticks;
  }, [atm]);

  useEffect(() => {
    const fetchChartData = async () => {
      if (!tick || !atm || !tickRangeData.length || !pToken || !qToken) {
        return;
      }

      const atmLongPrices = await getCalculatedLongPrices([tick]);
      const atmLongPrice = atmLongPrices?.[0] || null;

      const calculatedTickRange = tickRangeData.map(
        (xTick) => atm + (tick - xTick)
      );
      const tickRangeLongPrices = await getCalculatedLongPrices(
        calculatedTickRange
      );

      if (!atmLongPrice || !tickRangeLongPrices) {
        return [];
      }

      const atmTickPrice = tickToPrice(atm);
      const data = tickRangeData.map((xTick, i) => {
        const xTickLongPrice =
          tickRangeLongPrices[i] *
          ((atmTickPrice * tickToPrice(tick - atm)) /
            (atmTickPrice * tickToPrice(atm + (tick - xTick) - atm)));

        const xTickProfit =
          ((tickRangeLongPrices[i] - atmLongPrice) / atmLongPrice) * 100;

        const xTickPrice = atmTickPrice * tickToPrice(xTick - atm);

        return {
          tick: xTick,
          tickPrice: xTickPrice * 10 ** (pToken.decimals - qToken.decimals),
          price: xTickLongPrice * 10 ** (pToken.decimals - qToken.decimals),
          profit: xTickProfit,
        };
      });

      setChartData(data);
    };

    fetchChartData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tickRangeData, tick, atm]);

  const handleTickChange = async (value: number) => {
    if (!atm) {
      return;
    }

    setTick(value);
    setPercentageStrikePrice(formatePercentage(tickToProfit(value, atm)));

    if (!shortToken || !longTokenAmount) {
      toast({
        title: "Token Required",
        description: "Please select a token first",
      });
      return;
    }

    const tickLongPrices = await getCalculatedLongPrices([value]);
    const tickLongPrice = tickLongPrices?.[0] || null;

    if (tickLongPrice) {
      const shortTokenRawAmount = Math.floor(
        longTokenAmount.rawAmount * tickLongPrice
      );

      setShortTokenAmount({
        amount: tokenAmountToDecimal(
          shortTokenRawAmount,
          shortToken.decimals
        ).toString(),
        rawAmount: shortTokenRawAmount,
      });
    }
  };

  const [percentageStrikePrice, setPercentageStrikePrice] = useState("");

  const handlePercentageStrikePriceChange = (value: string) => {
    if (!atm || !tickRangeData.length) {
      return;
    }

    if (value === formatePercentage(tickToProfit(tick, atm))) {
      return;
    }

    if (value === "") {
      value = "0";
    }

    const percentage = parseFloat(value.replace("%", ""));
    if (isNaN(percentage)) {
      return;
    }

    const targetTick = profitToTick(percentage, atm);

    const start = tickRangeData[0];
    const end = tickRangeData[tickRangeData.length - 1];
    const clampedTick = Math.min(Math.max(targetTick, start), end);

    setPercentageStrikePrice(formatePercentage(tickToProfit(clampedTick, atm)));
    handleTickChange(clampedTick);
  };

  const handleChartClick = (data: CategoricalChartState) => {
    if (data && data.activePayload && data.activePayload[0] && atm) {
      const tick = data.activePayload[0].payload.tick;

      setPercentageStrikePrice(formatePercentage(tickToProfit(tick, atm)));
      handleTickChange(tick);
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
        <div className="flex justify-center text-lg font-medium rounded-xl p-2 w-24 bg-white border border-[#9747ff]">
          <Input
            value={percentageStrikePrice}
            onFocus={(e) => e.target.select()}
            onBlur={(e) => {
              handlePercentageStrikePriceChange(e.target.value);
            }}
            onChange={(e) => {
              const regex = /^-?[0-9]*\.?[0-9]*$/;
              if (e.target.value === "" || regex.test(e.target.value)) {
                setPercentageStrikePrice(e.target.value);
              }
            }}
            className="text-center border-0 p-0 bg-transparent text-gray-500"
            placeholder="0%"
            style={{ fontSize: "1.25rem" }}
          />
        </div>
        <div className="flex-1 mr-2">
          <Slider
            defaultValue={[tick]}
            value={[tick]}
            min={tickRangeData?.[0] || 0}
            max={tickRangeData?.[tickRangeData.length - 1] || 100}
            step={TICK_SPACE}
            onValueChange={([value]) => handleTickChange(value)}
            className="w-full [&_[role=slider]]:h-4 [&_[role=slider]]:w-4"
            rangeClassName="bg-[#9747ff]"
          />
        </div>
      </div>

      <div className="mt-4 h-[300px] border p-2 rounded-2xl">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chartData}
            margin={{ bottom: 8 }}
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
              formatter={(value: number, name: string, payload: any) => {
                const price = payload?.payload?.price || 0;
                const tickPrice = payload?.payload?.tickPrice || 0;

                return [
                  <>
                    <div className="text-gray-500">
                      PnL: {formatePercentage(value)}
                    </div>
                    <div className="text-gray-500">
                      Spot Price: {formatNumberWithDecimals(tickPrice)}
                    </div>
                    <div className="text-gray-500">
                      Long Price: {formatNumberWithDecimals(price)}x
                    </div>
                  </>,
                ];
              }}
              labelClassName="hidden"
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
