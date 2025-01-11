"use client";

import { useEffect, useMemo, useState } from "react";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ReferenceLine,
  ResponsiveContainer,
} from "recharts";
import useLiquidityPositionStore from "@/stores/global/liquidity-position-store";
import {
  profitToTick,
  TICK_SPACE,
  tickToPrice,
  tickToProfit,
  tokenAmountToDecimal,
} from "@/utils/currency";
import { usePeripheryContract } from "@/app/_hooks/usePeripheryContract";
import { formatePercentage, formatNumberWithDecimals } from "@/utils/number";
import { toast } from "@/hooks/use-toast";

const MIN_TICK_STEP_DISTANCE = 0;

const SelectStrikePriceRange = () => {
  const {
    startTick,
    endTick,
    setStartTick,
    setEndTick,
    setShortTokenAmount,
    shortToken,
    longTokenAmount,
    setLongTokenAmount,
  } = useLiquidityPositionStore();

  const { atm, getContractUtilization } = usePeripheryContract(
    process.env.NEXT_PUBLIC_VOILATILE_CONTRACT_ADDRESS as string
  );

  const [chartData, setChartData] = useState<
    Array<{
      tick: number;
      utilization: number;
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
      if (!startTick || !endTick || !atm || !tickRangeData.length) {
        return;
      }

      const tickRangeUtilizations = await getContractUtilization(tickRangeData);

      if (!tickRangeUtilizations) {
        return [];
      }

      const data = tickRangeData.map((xTick, i) => {
        const xTickUtilization = tickRangeUtilizations[i];

        return {
          tick: xTick,
          utilization: xTickUtilization?.utilization || 0,
        };
      });

      setChartData(data);
    };

    fetchChartData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tickRangeData, startTick, endTick, atm]);

  const handleTickChange = async (
    inputStartTick: number,
    inputEndTick: number
  ) => {
    if (!atm) {
      return;
    }

    setStartTick(inputStartTick);
    setEndTick(inputEndTick);

    const n = inputEndTick - atm + 1 > 0 ? inputEndTick - atm + 1 : 0;
    const m = atm - inputStartTick > 0 ? atm - inputStartTick : 0;

    if (n === 0) {
      setLongTokenAmount({ amount: "", rawAmount: 0 });
      return;
    }

    if (m === 0) {
      setShortTokenAmount({ amount: "", rawAmount: 0 });
      return;
    }

    if (!shortToken || !longTokenAmount || !atm) {
      toast({
        title: "Token Required",
        description: "Please select a token first",
      });
      return;
    }

    const upperTicks =
      Math.floor((inputEndTick - atm) / TICK_SPACE) + 1 > 0
        ? Array.from(
            { length: Math.floor((inputEndTick - atm) / TICK_SPACE) + 1 },
            (_, i) => atm + i * TICK_SPACE
          )
        : [];

    const lowerTicks =
      Math.floor((atm - inputStartTick) / TICK_SPACE) > 0
        ? Array.from(
            { length: Math.floor((atm - inputStartTick) / TICK_SPACE) },
            (_, i) => atm - (i + 1) * TICK_SPACE
          )
        : [];

    if (upperTicks.length === 0) {
      toast({
        title: "Invalid Range",
        description: "Please select a valid price range.",
      });
      return;
    }

    const shortTokenRawAmount = Math.floor(
      (longTokenAmount.rawAmount / upperTicks.length) *
        lowerTicks.reduce((acc, t) => acc + tickToPrice(t), 0)
    );

    setShortTokenAmount({
      amount: tokenAmountToDecimal(
        shortTokenRawAmount,
        shortToken.decimals
      ).toString(),
      rawAmount: shortTokenRawAmount,
    });
  };

  const [percentageStartStrikePrice, setPercentageStartStrikePrice] =
    useState("");

  useEffect(() => {
    if (!atm || !startTick) {
      return;
    }

    setPercentageStartStrikePrice(
      formatePercentage(tickToProfit(startTick, atm))
    );
  }, [startTick, atm]);

  const handlePercentageStartStrikePriceChange = (value: string) => {
    if (!atm || !tickRangeData.length || !endTick) {
      return;
    }

    if (value === formatePercentage(tickToProfit(startTick, atm))) {
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
    const clampedTick = Math.min(
      Math.max(targetTick, start),
      endTick - TICK_SPACE * MIN_TICK_STEP_DISTANCE
    );

    setPercentageStartStrikePrice(
      formatePercentage(tickToProfit(clampedTick, atm))
    );
    setStartTick(clampedTick);
    handleTickChange(clampedTick, endTick);
  };

  const [percentageEndStrikePrice, setPercentageEndStrikePrice] = useState("");
  useEffect(() => {
    if (!atm || !endTick) {
      return;
    }

    setPercentageEndStrikePrice(formatePercentage(tickToProfit(endTick, atm)));
  }, [endTick, atm]);

  const handlePercentageEndStrikePriceChange = (value: string) => {
    if (!atm || !tickRangeData.length || !startTick) {
      return;
    }

    if (value === formatePercentage(tickToProfit(endTick, atm))) {
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

    const end = tickRangeData[tickRangeData.length - 1];
    const clampedTick = Math.min(
      Math.max(startTick + TICK_SPACE * MIN_TICK_STEP_DISTANCE, targetTick),
      end
    );

    setPercentageEndStrikePrice(
      formatePercentage(tickToProfit(clampedTick, atm))
    );
    setEndTick(clampedTick);
    handleTickChange(startTick, clampedTick);
  };

  const XAxisLabel = useMemo(() => {
    return "Tick Index";
  }, []);

  const YAxisLabel = useMemo(() => {
    return "Utilization";
  }, []);

  return (
    <div className="w-full">
      <h3 className="text-xs font-medium mb-2">Select Strike Price Range</h3>

      <div className="h-[300px] border p-2 rounded-2xl">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ bottom: 10 }}>
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
              dataKey="utilization"
              label={{
                value: YAxisLabel,
                angle: -90,
                position: "insideLeft",
                fontSize: 12,
              }}
              domain={[0, 1]}
              tick={{ fontSize: 11 }}
              tickFormatter={(utilization) =>
                formatNumberWithDecimals(utilization)
              }
            />

            <Tooltip
              contentStyle={{ fontSize: "12px", padding: "4px 8px" }}
              formatter={(value: number, name: string, payload: any) => {
                const tick = payload?.payload?.tick || 0;
                const utilization = payload?.payload?.utilization || 0;
                return [
                  <>
                    <div className="text-gray-500">
                      Tick Index: {formatNumberWithDecimals(tick)}
                    </div>
                    <div className="text-gray-500">
                      Utilization: {formatNumberWithDecimals(utilization)}
                    </div>
                  </>,
                ];
              }}
              labelClassName="hidden"
            />

            <Bar dataKey="utilization" fill="#8884d8" />

            <ReferenceLine
              x={startTick}
              stroke="rgb(75, 192, 192)"
              strokeDasharray="3 3"
            />

            <ReferenceLine
              x={endTick}
              stroke="rgb(75, 192, 192)"
              strokeDasharray="3 3"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="border rounded-2xl p-1 flex gap-3 items-center mt-2">
        <div className="flex justify-center text-lg font-medium rounded-xl p-2 w-24 bg-white border border-[#9747ff]">
          <Input
            value={percentageStartStrikePrice}
            onFocus={(e) => e.target.select()}
            onBlur={(e) => {
              handlePercentageStartStrikePriceChange(e.target.value);
            }}
            onChange={(e) => {
              const regex = /^-?[0-9]*\.?[0-9]*$/;
              if (e.target.value === "" || regex.test(e.target.value)) {
                setPercentageStartStrikePrice(e.target.value);
              }
            }}
            className="text-center border-0 p-0 bg-transparent text-gray-500"
            placeholder="0%"
            style={{ fontSize: "1.25rem" }}
          />
        </div>

        <div className="flex-1 mr-2">
          <Slider
            defaultValue={[startTick, endTick]}
            value={[startTick, endTick]}
            min={tickRangeData?.[0] || 0}
            max={tickRangeData?.[tickRangeData.length - 1] || 100}
            step={TICK_SPACE}
            onValueChange={(value: [number, number]) =>
              handleTickChange(value[0], value[1])
            }
            className="w-full [&_[role=slider]]:h-4 [&_[role=slider]]:w-4"
            minStepsBetweenThumbs={MIN_TICK_STEP_DISTANCE}
            rangeClassName="bg-[#9747ff]"
          />
        </div>

        <div className="flex justify-center text-lg font-medium rounded-xl p-2 w-24 bg-white border border-[#9747ff]">
          <Input
            value={percentageEndStrikePrice}
            onFocus={(e) => e.target.select()}
            onBlur={(e) => {
              handlePercentageEndStrikePriceChange(e.target.value);
            }}
            onChange={(e) => {
              const regex = /^-?[0-9]*\.?[0-9]*$/;
              if (e.target.value === "" || regex.test(e.target.value)) {
                setPercentageEndStrikePrice(e.target.value);
              }
            }}
            className="text-center border-0 p-0 bg-transparent text-gray-500"
            placeholder="0%"
            style={{ fontSize: "1.25rem" }}
          />
        </div>
      </div>
    </div>
  );
};

export default SelectStrikePriceRange;
