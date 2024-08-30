import React, { useEffect, useState } from "react";
import Table from "react-bootstrap/Table";
import { useAccount } from "wagmi";
import { getChainDetails } from "./config";
import TokenSymbol from "./TokenSymbols";
import TokenBalance from "./TokenBalance";
import MintModal from "./MintModal";
import MintModal2 from "./MindModal2";
import { useSelector } from "react-redux";
import { readContract, getBalance } from "@wagmi/core";
import factoryAbi from "./ContractABIs/factoryAbi.json";
import { config } from "../Web3Provider";
import { ethers } from "ethers";
import { erc20Abi } from "viem";

const TokensTable = () => {
  const { isReferesh } = useSelector((state) => state.refreshFunctions);
  const { chain } = useAccount();

  const { address, isConnected } = useAccount();
  const [distributionNativeToken, setDistributionNativeToken] = useState({
    symbol: "",
    value: "",
  });
  const [tokensLength, setTokenLength] = useState([]);
  const [tokensLength2, setTokenLength2] = useState([]);

  const getUTokens = async () => {
    try {
      let chainDetail = getChainDetails(chain?.id);
      let tokens = await readContract(config, {
        abi: factoryAbi,
        address: chainDetail?.factoryAddress,
        functionName: "all_AllowedTokens",
      });
      let utokens = await readContract(config, {
        abi: factoryAbi,
        address: chainDetail?.factoryAddress,
        functionName: "all_uTokensOfAllowedTokens",
      });

      let filterAddresses = [];
      for (let index = 0; index < tokens.length; index++) {
        let res = await readContract(config, {
          abi: erc20Abi,
          address: tokens[index],
          functionName: "balanceOf",
          args: [address],
        });
        if (ethers.utils.formatEther(res) > 0) {
          filterAddresses.push(tokens[index]);
        }
      }
      setTokenLength(filterAddresses);

      let filterAddresses2 = [];
      for (let index = 0; index < utokens.length; index++) {
        let res = await readContract(config, {
          abi: erc20Abi,
          address: utokens[index],
          functionName: "balanceOf",
          args: [address],
        });
        if (ethers.utils.formatEther(res) > 0) {
          filterAddresses2.push(utokens[index]);
        }
      }
      setTokenLength2(filterAddresses2);
    } catch (error) {
      console.error("error while get u tokens", error);
    }
  };

  const getnative = async () => {
    try {
      const balance = await getBalance(config, {
        address: address,
      });
      setDistributionNativeToken({
        symbol: balance.symbol,
        value: ethers.utils.formatEther(balance.value),
      });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getUTokens();
    getnative();
  }, [isConnected, chain, address, isReferesh]);

  return (
    <div className="container p-0 boxes">
      <div className="row justify-content-center align-items-center ">
        <div className="row gx-0  pc-only-cards">
          <div className="col-lg-12 col-12 d-lg-flex d-block gap-3">
            <div className="col-lg-12 mb-3 col-12 text-start">
              <div className="boxes p-3 border border-primary ">
                <>
                  <Table
                    striped
                    className="custom-table flex-wrap mb-3 mt-1"
                    responsive>
                    <thead>
                      <tr>
                        <th className="text-white">Assets</th>
                        <th className="text-white">Balance</th>
                      </tr>
                    </thead>
                    <tbody>
                      {isConnected && (
                        <tr>
                          <td className="text-white ">
                            {distributionNativeToken.symbol &&
                              distributionNativeToken.value !== undefined && (
                                <div className="d-flex align-items-center text-light">
                                  <img
                                    src={`./tokenlist/${distributionNativeToken.symbol.toLocaleLowerCase()}.png`}
                                    alt="img"
                                    width={20}
                                  />
                                  <div className="d-block ms-2">
                                    <p className=" text-light mb-0">
                                      {distributionNativeToken.symbol}
                                    </p>
                                  </div>
                                </div>
                              )}
                          </td>
                          <td className="text-white text-break">
                            {parseFloat(distributionNativeToken.value).toFixed(
                              10
                            )}
                          </td>
                          <td>
                            <MintModal mintType="native" />
                          </td>
                        </tr>
                      )}
                      {isConnected &&
                        tokensLength?.map((tokenItem, index) => {
                          return (
                            <tr key={index}>
                              <td className="text-light d-flex">
                                <TokenSymbol tokenAddress={tokenItem} />
                              </td>
                              <td className="text-light">
                                <TokenBalance tokenAddress={tokenItem} />
                              </td>
                              <td>
                                <MintModal
                                  tokenAddress={tokenItem}
                                  mintType="token"
                                />
                              </td>
                            </tr>
                          );
                        })}
                      {isConnected &&
                        tokensLength2?.map((tokenItem, index) => {
                          return (
                            <tr key={index}>
                              <td className="text-light d-flex">
                                <TokenSymbol tokenAddress={tokenItem} />
                              </td>
                              <td className="text-light">
                                <TokenBalance tokenAddress={tokenItem} />
                              </td>
                              <td>
                                <MintModal2
                                  tokenAddress={tokenItem}
                                  mintType="token"
                                />
                              </td>
                            </tr>
                          );
                        })}
                    </tbody>
                  </Table>
                </>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TokensTable;
