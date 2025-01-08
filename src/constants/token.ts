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
    contractAddress: "0xa5Ce24b8927B7e601F114B08992C25E4Bf226211",
    name: "Volatile USDC",
    symbol: "vUSDC",
    image: "https://s2.coinmarketcap.com/static/img/coins/64x64/3408.png",
    decimals: 6,
    source: "coinmarketcap",
    searchId: "3408",
  },
];

export const defaultLongToken: Token = data[0];
export const defaultShortToken: Token = data[1];
