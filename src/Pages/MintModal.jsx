import React, { useState } from "react";
import { Button } from "react-bootstrap";
import DonatePopup from "./DonatePopup";
import { useAccount } from "wagmi";

function MintModal({ tokenAddress, mintType, setRefresh, refresh }) {
  const { isConnected } = useAccount();

  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const checkPassword = async () => {
    handleShow();
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

      <DonatePopup
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

export default MintModal;
