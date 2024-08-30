import { Contract, ethers } from "ethers";
import factoryAbi from "./ContractABIs/factoryAbi.json";
import swapFactoryAbi from "./ContractABIs/swapFactory.json";
import pairAbi from "./ContractABIs/pairAbi.json";
import { erc20Abi } from "viem";

export const defaultrId = 5;

const chains = [
  {
    id: 1,
    name: "Ethereum",
    networkId: 1, // This is mainnet for Ethereum
    rpc_url:
      "https://eth-mainnet.g.alchemy.com/v2/prlsv6gydi7XS-ubbSjCdT8dytnOyUOn",
    explorer: "https://etherscan.io",
    // factoryAddress: "0x9e4476f8ac13dcd07c9676e25aa641e5e0c283c4",
    wEthAddress: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
    contractAddress: "0xE94377B08554bDc06b3f5ad67b712ddAacf4079E",
    factoryAddress: "0xD867B0db5f0663DFFfa490050411273ce02bAB9A",
    DonationContract: "0x39994d28a843dcAA4D4B67d9E05045b122331025",
    // DonationContract: "0xd5B504242B7eE737AA265339f4FbeCb948d9406D",
    // DonationContract: "0xdd25471acfc3b29f67e5918d4d1d9493365140ba",
  },
  {
    id: 2,
    name: "Sepolia",
    rpc_url:
      "https://eth-sepolia.g.alchemy.com/v2/prlsv6gydi7XS-ubbSjCdT8dytnOyUOn",
    // contractAddress: "0x0031776c5e2aC1E64B1CFb91e724cfbC08A95710",
    networkId: 11155111,
    explorer: "https://sepolia.etherscan.io",
    contractAddress: "0xE94377B08554bDc06b3f5ad67b712ddAacf4079E",
    wEthAddress: "0xb16F35c0Ae2912430DAc15764477E179D9B9EbEa",
    // factoryAddress: "0x9e4476f8ac13dcd07c9676e25aa641e5e0c283c4",
    factoryAddress: "0xC150CBE8982F11E550BECE86381E1E5375431aB9",
    DonationContract: "0xd5B504242B7eE737AA265339f4FbeCb948d9406D",
  },
];

// Example function to fetch details by chain name:
export const getChainDetails = (chainId) => {
  const chain = chains.find((c) => c.networkId === chainId);
  return chain ? chain : null;
};

export const getChainExplorer = (chainId) => {
  try {
    let chain = chains.find((c) => c.networkId === chainId);

    if (chain) {
      return chain;
    } else {
      return chains.find((c) => c.networkId === defaultrId);
    }
  } catch (error) {
    console.error("error while get chain explorer", error);
  }
};
export const factoryInstance = async (chainId) => {
  try {
    let chain = chains.find((c) => c.networkId === chainId);
    let provider = new ethers.providers.Web3Provider(window.ethereum);
    let signer = provider.getSigner();
    return new Contract(chain.contractAddress, factoryAbi, signer);
  } catch (error) {
    console.error("errro while factory instance", error);
  }
};

export const remortFactoryInstnce = async (chainId) => {
  try {
    let chain = chains.find((c) => c.networkId === chainId);
    if (chain) {
      const provider = new ethers.providers.JsonRpcProvider(chain?.rpc_url);

      return new Contract(chain.contractAddress, factoryAbi, provider);
    } else {
      chain = chains.find((c) => c.networkId === defaultrId);
      const provider = new ethers.providers.JsonRpcProvider(chain?.rpc_url);
      return new Contract(chain.contractAddress, factoryAbi, provider);
    }
  } catch (error) {
    console.error("errro while remote factory instance", error);
  }
};

export const erc20Instance = async (tokenAddress) => {
  try {
    let provider = new ethers.providers.Web3Provider(window.ethereum);
    let signer = provider.getSigner();
    return new Contract(tokenAddress, erc20Abi, signer);
  } catch (error) {
    console.error("error while ecr20 instance", error);
  }
};
export const pairInstance = async (pairAddress, chainId) => {
  try {
    let chain = chains.find((c) => c.networkId === chainId);
    if (chain) {
      const provider = new ethers.providers.JsonRpcProvider(chain.rpc_url);
      return new Contract(pairAddress, pairAbi, provider);
    } else {
      chain = chains.find((c) => c.networkId === defaultrId);
      const provider = new ethers.providers.JsonRpcProvider(chain.rpc_url);
      return new Contract(pairAddress, pairAbi, provider);
    }
  } catch (error) {
    console.error("errro while remote factory instance", error);
  }
};
export const swapFactoryInstance = async (chainId) => {
  try {
    let chain = chains.find((c) => c.networkId === chainId);
    if (chain) {
      const provider = new ethers.providers.JsonRpcProvider(chain.rpc_url);
      return new Contract(chain.factoryAddress, swapFactoryAbi, provider);
    } else {
      chain = chains.find((c) => c.networkId === defaultrId);
      const provider = new ethers.providers.JsonRpcProvider(chain.rpc_url);
      return new Contract(chain.factoryAddress, swapFactoryAbi, provider);
    }
  } catch (error) {
    console.error("errro while remote factory instance", error);
  }
};

export const walletBalance = async (address) => {
  try {
    let provider = new ethers.providers.Web3Provider(window.ethereum);
    const balance = await provider.getBalance(address);
    return ethers.utils.formatEther(balance);
  } catch (error) {
    console.error("error while wallet balance", error);
  }
};
