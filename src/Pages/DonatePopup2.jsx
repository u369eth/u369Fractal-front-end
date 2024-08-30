import Modal from "react-bootstrap/Modal";
import React, { useEffect, useState } from "react";
import TransactionModal from "./TransactionModal";
import { useAccount, useBalance } from "wagmi";
import { getChainDetails } from "./config";
import CloseButton from "react-bootstrap/CloseButton";
import modallogo from "../assets/protectClaim.png";
import { Button } from "react-bootstrap";
import { toast } from "react-hot-toast";
import { ethers } from "ethers";
import { BeatLoader } from "react-spinners";
import Range from "./Range";
import { AiOutlineClose } from "react-icons/ai";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import TokenSymbol from "./TokenSymbols";
import donateAbi from "./ContractABIs/donateAbi.json";
import { useDispatch, useSelector } from "react-redux";
import { refreshBalance } from "../store/refresh";
import { AiFillEyeInvisible, AiFillEye } from "react-icons/ai";
import factoryAbi from "./ContractABIs/factoryAbi.json";

import {
  readContract,
  writeContract,
  waitForTransactionReceipt,
} from "@wagmi/core";
import { config } from "../Web3Provider";
import { erc20Abi } from "viem";

function DonatePopup2({ show, handleClose, mintType, tokenAddress }) {
  const { address, chain } = useAccount();
  const [showBalance, setShowBalance] = useState(null);
  const { data } = useBalance({ address: address });
  const dispatch = useDispatch();
  const { isReferesh } = useSelector((state) => state.refreshFunctions);
  const ChainDetails = getChainDetails(chain?.id);
  const [ethTrx, setEthTrx] = useState("");
  const [showEthTrx, setShowEthTrx] = useState("");

  const [pass, setPass] = useState();
  const [isSeePass, setIsSeePass] = useState(false);

  const modalVariants = {
    hidden: { opacity: 0, y: "-50%" },
    visible: { opacity: 1, y: "0" },
    exit: { opacity: 0, y: "50%" },
  };

  const [showTrx, setShowTrx] = useState(false);
  const [trxHash, setTrxHash] = useState({
    link: null,
    amount: null,
    address: null,
    trxType: null,
    mintType: null,
  });

  const getBal = async () => {
    try {
      if (mintType === "native") {
        let bal = ethers.utils.formatEther(data?.value);
        if (bal) setShowBalance(parseFloat(bal).toFixed(10).toString());
        setShowEthTrx(bal.toString());
      } else if (mintType === "token") {
        let bal = await readContract(config, {
          abi: erc20Abi,
          address: tokenAddress,
          functionName: "balanceOf",
          args: [address],
        });

        let num = ethers?.utils?.formatEther(bal);
        setShowBalance(Number(num).toFixed(10).toString());
        setShowEthTrx(num.toString());
      }
    } catch (error) {
      console.error("error while get bal", error);
    }
  };

  useEffect(() => {
    getBal();
  }, [data?.value, showBalance]);

  let [etherAmount, setEtherAmount] = useState();
  let [percentValue, setPercentValue] = useState(0);

  const barAmount = (percent) => {
    setPercentValue(percent);
    let amount = ((showBalance * percent) / 100).toString();
    setEtherAmount(parseFloat(amount).toFixed(10));

    if (percent === 100) {
      setEthTrx(showEthTrx);
    } else {
      setEthTrx(((showEthTrx * percent) / 100).toString());
    }
  };
  const [isLoading, setIsLoading] = useState(false);

  const mintU_tokens = async () => {
    try {
      if (getChainDetails(chain.id)) {
        if (
          ethTrx <= 0 ||
          ethTrx == null ||
          ethTrx === undefined ||
          ethTrx === ""
        ) {
          toast.error("Enter amount please");
          setIsLoading(false);
          return;
        }
        setIsLoading(true);

        const isCorrectPass = await readContract(config, {
          abi: factoryAbi,
          address: ChainDetails?.factoryAddress,
          functionName: "isPasswordCorrect",
          args: [address, pass],
        });

        if (!isCorrectPass) {
          toast.error("Enter correct password");
          setIsLoading(false);
          return;
        }

        if (mintType === "token") {
          const allowance = await readContract(config, {
            abi: erc20Abi,
            address: tokenAddress,
            functionName: "allowance",
            args: [address, ChainDetails?.DonationContract],
          });

          if (Number(allowance) < Number(ethTrx)) {
            const maxApproval = ethers.constants.MaxUint256;
            const approve = await writeContract(config, {
              abi: erc20Abi,
              address: tokenAddress,
              functionName: "approve",
              args: [ChainDetails?.DonationContract, maxApproval.toString()],
              gasLimit: 1000000,
            });

            const transactionReceipt = await waitForTransactionReceipt(config, {
              hash: approve,
            });
          }

          const hash = await writeContract(config, {
            abi: donateAbi,
            address: ChainDetails?.DonationContract,
            functionName: "donateAndDistributeERC20",
            args: [tokenAddress, ethers.utils.parseEther(ethTrx).toString()],
            gasLimit: 1000000,
          });

          const transactionReceipt1 = await waitForTransactionReceipt(config, {
            hash: hash,
          });

          let { explorer } = getChainDetails(chain.id);

          setTrxHash({
            link: `${explorer}/tx/${hash}`,
            amount: etherAmount,
            address: tokenAddress,
            trxType: "transfer",
            mintType: mintType,
          });
        } else if (mintType === "native") {
          const hash = await writeContract(config, {
            abi: donateAbi,
            address: ChainDetails?.DonationContract,
            functionName: "donateAndDistribute",
            value: ethers.utils.parseEther(ethTrx).toString(),
          });

          const transactionReceipt1 = await waitForTransactionReceipt(config, {
            hash: hash,
          });

          let { explorer } = getChainDetails(chain.id);
          setTrxHash({
            link: `${explorer}/tx/${hash}`,
            amount: etherAmount,
            address: tokenAddress,
            trxType: "transfer",
            mintType: mintType,
          });
        }

        setShowTrx(true);
        toast.success("Token Donated");
        setIsLoading(false);
        setPass(null);
        dispatch(refreshBalance(!isReferesh));
        getBal();
        setPercentValue(0);
        setEthTrx("");
        setEtherAmount(null);
        handleClose();
      }
    } catch (error) {
      setIsLoading(false);
      setPass(null);
      setEthTrx("");
      const errorData = JSON.parse(JSON.stringify(error));
      console.error("error while donation", error);
      if (errorData.shortMessage) {
        toast.error(errorData.shortMessage);
        return;
      } else if (errorData.reason) {
        toast.error(errorData.reason);
        return;
      }
      if (errorData.reason) {
        toast.error(errorData.reason);
        return;
      }
      if (errorData.name) {
        toast.error(errorData.name);
      } else if (errorData.error && chain.id === 80001) {
        toast.error(errorData.error);
      }
    }
  };
  const valueHandler = (value) => {
    if (Number(value) >= Number(showEthTrx)) {
      setEtherAmount(showBalance);
      setEthTrx(showEthTrx);
      setPercentValue(100);
    } else {
      setEtherAmount(value);
      setEthTrx(value);
      setPercentValue(parseInt((value / showBalance) * 100));
    }
  };

  return (
    <>
      <TransactionModal
        showTrx={showTrx}
        setShowTrx={setShowTrx}
        trxHash={trxHash}
      />
      <Modal show={show} onHide={handleClose} centered style={{ zIndex: 999 }}>
        <motion.div
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={modalVariants}>
          <Modal.Header>
            <img src={modallogo} alt="" width={60} className="me-1" />
            <CloseButton
              variant="white"
              onClick={() => {
                setEtherAmount(null);
                setPercentValue(0);
                setIsLoading(false);
                setPass(null);
                setEthTrx("");
                handleClose();
              }}
            />
          </Modal.Header>
          <Modal.Body>
            <>
              {
                <div className="container pt-0 mt-0">
                  <div className="row justify-content-center">
                    <div className="col-lg-12 text-center justify-content-center d-flex p-0">
                      <div className="col-lg-12 col-12 box">
                        <div className="d-flex justify-content-center mx-4 mt-2">
                          <h5 className="color_text text-center">Donate</h5>
                          <div className="justify-content-end d-flex">
                            <Link to="/home">
                              <AiOutlineClose
                                className="color_close text-end fs-3 d-none"
                                style={{ cursor: "pointer" }}
                              />
                            </Link>
                          </div>
                        </div>
                        <p className="text-end mb-0 text-wid lighttext">
                          {showBalance && `Balance: ${showBalance} `}
                        </p>
                        <div className="modalselect w-100 d-flex justify-content-center">
                          <div className=" wid p-2">
                            <p className="form-label text-start">
                              <strong>Send</strong>
                            </p>
                            <input
                              type="number"
                              style={{
                                border: "1px solid #0d6efd",
                                outline: "none",
                                backgroundColor: "transparent",
                                color: "white",
                                width: "100%",
                                fontSize: "1rem",
                                fontWeight: 400,
                                lineHeight: 1.5,
                                borderRadius: ".25rem",
                                padding: "9px",
                              }}
                              placeholder="0"
                              value={etherAmount}
                              onChange={(e) => {
                                if (showBalance) {
                                  valueHandler(e.target.value);
                                } else {
                                  setEtherAmount(e.target.value);
                                }
                                setPercentValue(
                                  parseInt((e.target.value / showBalance) * 100)
                                );
                              }}
                              className=" mb-1 text-white"
                            />
                          </div>
                          <button className="d-flex justify-content-center align-items-center select_token  text-start border-0  bg-primary add_wallet  rad">
                            {mintType === "token" ? (
                              <TokenSymbol tokenAddress={tokenAddress} />
                            ) : (
                              <>
                                <img
                                  src={`./tokenlist/${chain?.nativeCurrency.symbol.toLowerCase()}.png`}
                                  alt=""
                                  width={20}
                                  className="me-1"
                                />
                                {`${chain?.nativeCurrency.symbol}`}
                              </>
                            )}
                          </button>
                        </div>

                        <div className="w-100 d-lg-flex d-block justify-content-center align-items-center ">
                          <div className=" popupWidth rad d-flex justify-content-center mx-auto">
                            <Range
                              percentValue={percentValue}
                              barAmount={barAmount}
                              isDisable={showBalance}
                            />
                            <span
                              className="ms-3 mt-1 lighttext"
                              style={{
                                cursor: "pointer",
                                border: "1px solid rgb(13, 110, 253)",
                                padding: "1px 5px",
                                borderRadius: "10px",
                              }}
                              onClick={() => barAmount(100)}>
                              Max
                            </span>
                            <span className="ms-2 mt-1 lighttext">
                              {showBalance && `${percentValue}%`}
                            </span>
                          </div>
                        </div>
                        <div className="w-100 d-flex justify-content-center mb-3 mt-n2">
                          <div className="radius_box popupWidth p-2 mx-auto">
                            <p className="form-label text-start">
                              <strong>Sign Key</strong>
                            </p>
                            <input
                              type={isSeePass ? "text" : "password"}
                              name=""
                              id=""
                              style={{
                                border: "1px solid #0d6efd",
                                outline: "none",
                                backgroundColor: "transparent",
                              }}
                              className="token_inp w-100 p-2"
                              placeholder=""
                              onChange={(e) => setPass(e.target.value)}
                            />
                            <div
                              style={{
                                background: "rgba(225, 55, 190, 0.45)",
                              }}
                              className="bg-primary text-light bor mt-2"
                              onClick={() => setIsSeePass(!isSeePass)}>
                              {isSeePass ? (
                                <AiFillEyeInvisible />
                              ) : (
                                <AiFillEye />
                              )}
                            </div>
                          </div>
                        </div>
                        <Button
                          className="wid protect rad mb-1 p-2 bg-primary mt-2"
                          onClick={mintU_tokens}>
                          {isLoading ? <BeatLoader color="#fff" /> : "Donate"}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              }
            </>
          </Modal.Body>
        </motion.div>
      </Modal>
    </>
  );
}

export default DonatePopup2;
