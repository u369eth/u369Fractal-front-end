import React, { useEffect, useState } from "react";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import { useAccount } from "wagmi";
import { ethers } from "ethers";
import { useSelector } from "react-redux";
import { erc20Abi } from "viem";
import { readContract } from "@wagmi/core";
import { config } from "../Web3Provider";

function TokenBalance({ tokenAddress }) {
  const { isReferesh } = useSelector((state) => state.refreshFunctions);
  const { address, chain } = useAccount();
  const [tokenBal, setTokenBal] = useState(null);
  const getTokenBal = async () => {
    try {
      let res = await readContract(config, {
        abi: erc20Abi,
        address: tokenAddress,
        functionName: "balanceOf",
        args: [address],
      });
      setTokenBal(ethers.utils.formatEther(res));
    } catch (error) {
      console.error("error while get token balance", error);
    }
  };
  useEffect(() => {
    getTokenBal();
  }, [tokenBal, address, isReferesh, chain]);
  return (
    <>
      {tokenBal !== null ? (
        Number(tokenBal).toFixed(4)
      ) : (
        <SkeletonTheme baseColor="#202020" highlightColor="#444">
          <Skeleton count={1} inline width={100} />
        </SkeletonTheme>
      )}
    </>
  );
}

export default TokenBalance;
