export type Token = {
  chainId: number;
  contractAddress: string;
  name: string;
  symbol: string;
  image: string;
  decimals: number;
  source: string;
  searchId: string;
};

export const data: Token[] = [
  // Sepolia
  {
    chainId: 11155111,
    contractAddress: "0x4E62D245B56FcD20e73b7875AEe99Db4ADb01Fa6",
    name: "Volatile Ethereum",
    symbol: "vETH",
    image: "https://s2.coinmarketcap.com/static/img/coins/64x64/1027.png",
    decimals: 18,
    source: "coinmarketcap",
    searchId: "1027",
  },
  {
    chainId: 11155111,
    contractAddress: "0xa39817cB69a460ca75E9884341AFe8B89543D281",
    name: "Volatile USDC",
    symbol: "vUSDC",
    image: "https://s2.coinmarketcap.com/static/img/coins/64x64/3408.png",
    decimals: 6,
    source: "coinmarketcap",
    searchId: "3408",
  },
];
