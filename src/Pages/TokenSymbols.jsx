import React, { useEffect, useState } from "react";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import { erc20Abi } from "viem";
import { readContract } from "@wagmi/core";
import { config } from "../Web3Provider";

function TokenSymbol({ tokenAddress }) {
  const [tokenSymbol, setTokenSymbol] = useState(null);
  const getTokenSymbol = async () => {
    try {
      let symbol = await readContract(config, {
        abi: erc20Abi,
        address: tokenAddress,
        functionName: "symbol",
      });
      setTokenSymbol(symbol);
    } catch (error) {
      console.error("error while get token symbol", error);
    }
  };
  useEffect(() => {
    getTokenSymbol();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tokenSymbol]);
  return (
    <>
      {tokenSymbol ? (
        <>
          <img
            src={`./tokenlist/${tokenSymbol?.toLowerCase()}.png`}
            alt={tokenSymbol.toLowerCase()}
            width={20}
            className="me-2"
          />
          {tokenSymbol}
        </>
      ) : (
        <SkeletonTheme baseColor="#202020" highlightColor="#444">
          <Skeleton count={1} inline width={100} />
        </SkeletonTheme>
      )}
    </>
  );
}

export default TokenSymbol;
