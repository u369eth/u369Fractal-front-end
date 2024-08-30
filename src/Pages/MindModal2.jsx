import React, { useState } from "react";
import { Button } from "react-bootstrap";
import DonatePopup2 from "./DonatePopup2";
import PasswordModal from "./PasswordModal";
import { getChainDetails } from "./config";
import { useAccount } from "wagmi";
import factoryAbi from "./ContractABIs/factoryAbi.json";
import { readContract } from "@wagmi/core";
import { config } from "../Web3Provider";

function MintModal2({ tokenAddress, mintType, setRefresh, refresh }) {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [show1, setShow1] = useState(false);
  const handleClose1 = () => setShow1(false);
  const handleShow1 = () => setShow1(true);

  const { address, isConnected } = useAccount();

  const { chain } = useAccount();
  let chainDetail = getChainDetails(chain?.id);

  const checkPassword = async () => {
    const data = await readContract(config, {
      abi: factoryAbi,
      address: chainDetail?.factoryAddress,
      functionName: "isPasswordSet",
      args: [address],
    });
    if (!data) {
      handleShow1();
    } else {
      handleShow();
    }
  };
  return (
    <>
      <Button
        variant="primary"
        className="font_size border border-primary bg-transparent px-3 py-1 text-clr text-white"
        onClick={checkPassword}
        disabled={!isConnected}>
        Donate
      </Button>
      <PasswordModal
        handleShow={handleShow}
        show={show1}
        handleClose={handleClose1}
      />
      <DonatePopup2
        show={show}
        handleClose={handleClose}
        mintType={mintType}
        tokenAddress={tokenAddress}
        setRefresh={setRefresh}
        refresh={refresh}
      />
    </>
  );
}

export default MintModal2;
