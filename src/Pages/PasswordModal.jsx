import React, { useEffect, useState } from "react";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import BeatLoader from "react-spinners/BeatLoader";
import { motion } from "framer-motion";
import { useAccount } from "wagmi";
import { writeContract, waitForTransactionReceipt } from "@wagmi/core";
import CloseButton from "react-bootstrap/CloseButton";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { FiCopy } from "react-icons/fi";
import factoryAbi from "./ContractABIs/factoryAbi.json";
import { toast } from "react-hot-toast";
import { getChainDetails } from "./config";
import TransactionModal from "./TransactionModal";
import { config } from "../Web3Provider";

export default function PasswordModal({ show, handleClose, handleShow }) {
  const { chain } = useAccount();
  const ChainDetails = getChainDetails(chain?.id);

  const generateRandomString = () => {
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let randomString = "";

    for (let i = 0; i < 64; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      randomString += characters.charAt(randomIndex);
    }
    let formattedString = "";
    for (let i = 0; i < randomString.length; i++) {
      if (i > 0 && i % 5 === 0) {
        formattedString += "-";
      }
      formattedString += randomString[i];
    }
    return formattedString;
  };
  const [phrase, setPhrase] = useState(generateRandomString());
  let [isEnable, setIsEnable] = useState(false);
  let [isEnable2, setIsEnable2] = useState(false);

  const [showTrx, setShowTrx] = useState(false);
  const [trxHash, setTrxHash] = useState({
    link: null,
    trxType: null,
  });
  const [isSeePass, setIsSeePass] = useState(false);
  const [isSeeCPass, setIsSeeCPass] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const seePass = (e) => {
    e.preventDefault();
    setIsSeePass(!isSeePass);
  };
  const seeCPass = (e) => {
    e.preventDefault();
    setIsSeeCPass(!isSeeCPass);
  };
  const copyPhrase = (e) => {
    e.preventDefault();
    navigator.clipboard.writeText(phrase);
    toast.success("copied");
  };
  const [pass, setPass] = useState({
    password: "",
    confirmPassword: "",
  });
  const [isShowMessage, setIsShowMessage] = useState(false);
  const [message, setIsMessage] = useState("");
  const savePssword = async () => {
    try {
      if (getChainDetails(chain?.id)) {
        let { password, confirmPassword } = pass;
        if (
          password === null ||
          password === undefined ||
          password === "" ||
          confirmPassword === null ||
          confirmPassword === undefined ||
          confirmPassword === ""
        ) {
          setIsMessage("Sign key is mendatory");
          setIsShowMessage(true);
          return;
        }
        if (password !== confirmPassword) {
          setIsMessage("Sign key doesn't match");
          setIsShowMessage(true);
          return;
        }
        setIsMessage("");

        setIsLoading(true);

        let hash = await writeContract(config, {
          abi: factoryAbi,
          address: ChainDetails.factoryAddress,
          functionName: "setMasterKeyAndSignKey",
          args: [password, phrase],
        });

        const transactionReceipt = await waitForTransactionReceipt(config, {
          hash: hash,
        });
        let { explorer } = getChainDetails(chain.id);
        setTrxHash({
          link: `${explorer}/tx/${hash}`,
          trxType: "password",
        });
        setShowTrx(true);
        handleClose();
        // handleShow();
        setIsLoading(false);
        return;
      }
    } catch (error) {
      setIsLoading(false);
      console.error("error while save password", error);
    }
  };
  const modalVariants = {
    hidden: { opacity: 0, y: "-50%" },
    visible: { opacity: 1, y: "0" },
    exit: { opacity: 0, y: "50%" },
  };

  // useEffect(() => {
  //   if (isConfirmed) {
  //     handleClose();
  //     handleShow();
  //     setIsLoading(false);
  //   }
  // }, [isConfirmed]);

  const [isClicked, setIsClicked] = useState(false);

  const handleClick = () => {
    // Set the state to true
    setIsClicked(true);

    // After 2 seconds, set the state back to false
    setTimeout(() => {
      setIsClicked(false);
    }, 2000);
  };

  return (
    <>
      <TransactionModal
        showTrx={showTrx}
        setShowTrx={setShowTrx}
        trxHash={trxHash}
        ProtectShow={handleShow}
      />
      <Modal show={show} onHide={handleClose} centered>
        <motion.div
          initial="hidden"
          animate="visible"
          exit="exit"
          style={{ border: "1px solid #0d6efd", borderRadius: "20px" }}
          variants={modalVariants}>
          <Modal.Header
            className=" px-3 pe-3"
            style={{ backgroundColor: "transaprent", color: "white" }}>
            <Modal.Title style={{ fontSize: "22px" }}>
              Concealed Master Key{" "}
            </Modal.Title>
            <CloseButton
              variant="white"
              onClick={() => {
                handleClose();
                setIsLoading(false);
              }}
            />
          </Modal.Header>
          <Modal.Body style={{ paddingBottom: 0 }}>
            <Form>
              <Form.Group className="mb-3" controlId="formBasicEmail">
                <div className="d-flex gap-3">
                  <Form.Control
                    className="w-75 text-light bg-transparent border border-primary"
                    value={phrase}
                    readOnly
                    disabled
                    type="password"
                    style={{ height: "40px" }}
                  />
                  <button
                    style={{ borderRadius: "15px", height: "40px" }}
                    className="w-25  ms-1 btn btn-primary bg-transparent border border-primary"
                    onClick={(e) => {
                      copyPhrase(e);
                      setIsEnable2(true);
                      handleClick();
                    }}>
                    {isClicked ? <input type="checkbox" checked /> : <FiCopy />}
                  </button>
                </div>

                <Form.Text className="text-light fw-bold list mb-0">
                  {/* <ul className=" mt-2 mb-0"> */}
                  <div className="mt-2">
                    <p>
                      The above is your encrypted and randomly-generated Private
                      Master key. It's only presented once.
                    </p>
                    <p>
                      Before setting your Sign Key (password/PIN), ensure to
                      copy and save the Private Master key in a safe place
                      (ideally offline).
                    </p>
                    <p>
                      Your protected tokens can only be sent after you input
                      your Sign Key. If you lose your Sign Key and don't have
                      the Private Master Key, you won’t be able to interact with
                      this smart contract.
                    </p>
                    To set Sign Key:
                    <ul>
                      <li>Copy and save the Master Key in a safe place.</li>
                      <li>Check the box below:</li>
                    </ul>
                  </div>
                </Form.Text>

                <div className="d-flex mt-0">
                  <input
                    type="checkbox"
                    onChange={(e) => {
                      setIsEnable(e.target.checked);
                    }}
                  />
                  <label htmlFor="" className="ms-3">
                    I understand that u369 cannot recover the Sign Key for me.
                  </label>
                </div>
              </Form.Group>
              {isEnable && isEnable2 && (
                <>
                  <Form.Group className="mb-1" controlId="formBasicPassword">
                    <Form.Label>Set Sign Key</Form.Label>
                    <div className="d-flex gap-3">
                      <Form.Control
                        className="w-75 text-light bg-transparent border border-primary"
                        type={isSeePass ? "text" : "password"}
                        placeholder=""
                        style={{ height: "40px" }}
                        onChange={(e) => {
                          setPass({ ...pass, password: e.target.value });
                        }}
                      />
                      <button
                        style={{ borderRadius: "15px", height: "40px" }}
                        className="w-25 btn btn-primary bg-transparent border border-primary  ms-1"
                        onClick={(e) => seePass(e)}>
                        {isSeePass ? (
                          <AiFillEyeInvisible style={{ marginTop: "-10px" }} />
                        ) : (
                          <AiFillEye style={{ marginTop: "-10px" }} />
                        )}
                      </button>
                    </div>
                  </Form.Group>

                  <Form.Group className="mb-4" controlId="formBasicPassword">
                    <Form.Label>Confirm Sign Key</Form.Label>
                    <div className="d-flex gap-3">
                      <Form.Control
                        type={isSeeCPass ? "text" : "password"}
                        placeholder=""
                        style={{ height: "40px" }}
                        className="w-75 text-light bg-transparent border border-primary"
                        onChange={(e) => {
                          setPass({ ...pass, confirmPassword: e.target.value });
                        }}
                      />

                      <button
                        style={{ borderRadius: "15px", height: "40px" }}
                        className="w-25 btn btn-primary bg-transparent border border-primary  ms-1"
                        onClick={(e) => seeCPass(e)}>
                        {isSeeCPass ? (
                          <AiFillEyeInvisible style={{ marginTop: "-10px" }} />
                        ) : (
                          <AiFillEye style={{ marginTop: "-10px" }} />
                        )}
                      </button>
                    </div>
                    {isShowMessage && (
                      <Form.Text className="text-danger">{message}</Form.Text>
                    )}
                  </Form.Group>
                </>
              )}
            </Form>
          </Modal.Body>
          {isEnable && isEnable2 && (
            <Modal.Footer style={{ border: "none", paddingTop: 0 }}>
              <button
                className="btn btn-primary bg-transparent border border-primary w-25"
                style={{
                  borderRadius: "15px",
                  marginLeft: "auto",
                  marginRight: "auto",
                }}
                onClick={savePssword}>
                {isLoading ? <BeatLoader color="#fff" /> : "Enable"}
              </button>
            </Modal.Footer>
          )}
        </motion.div>
      </Modal>
    </>
  );
}
