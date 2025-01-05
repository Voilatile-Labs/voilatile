"use client";

import SelectTokenDropdown from "./select-token-dropdown";
import useLongPositionStore from "@/stores/global/long-position-store";

const SelectTokenPair = () => {
  const {
    longToken,
    setLongToken,
    shortToken,
    setShortToken,
    setLongTokenAmount,
    setShortTokenAmount,
  } = useLongPositionStore();

  return (
    <div className="w-full">
      <h3 className="text-xs font-medium mb-2">Select pair</h3>

      <div className="flex gap-2">
        <SelectTokenDropdown
          token={longToken}
          onTokenSelect={(token) => {
            if (longToken?.contractAddress === token.contractAddress) {
              return;
            }

            if (shortToken?.contractAddress === token.contractAddress) {
              setShortToken(undefined);
            }

            setLongTokenAmount({ amount: "", rawAmount: 0 });
            setShortTokenAmount({ amount: "", rawAmount: 0 });
            setLongToken(token);
          }}
        />

        <SelectTokenDropdown
          token={shortToken}
          onTokenSelect={(token) => {
            if (shortToken?.contractAddress === token.contractAddress) {
              return;
            }

            if (longToken?.contractAddress === token.contractAddress) {
              setLongToken(undefined);
            }

            setLongTokenAmount({ amount: "", rawAmount: 0 });
            setShortTokenAmount({ amount: "", rawAmount: 0 });
            setShortToken(token);
          }}
        />
      </div>
    </div>
  );
};

export default SelectTokenPair;
