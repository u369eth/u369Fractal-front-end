import React from "react";
import { MdEmail } from "react-icons/md";
import { AiOutlineGithub, AiOutlineInstagram } from "react-icons/ai";
import { FaTelegramPlane } from "react-icons/fa";
import twitter from "../../src/assets/Twitter-new-logo-removebg-preview.png";
import Adiole from "./Adiole";
const Footer = () => {
  return (
    <div className="bg_footer">
      <div className="container p-0 mb-lg-0 mb-2 pb-lg-0 pb-0">
        <div className="row gx-0 text-center">
          <div className="col-lg-12  mobileFooter">
            <p className="footer_font  mobileFooter  ">
              <Adiole className="fs-2 mr-2" />
              Allodial State To Your Crypto HODLings
            </p>

            <div className="d-flex justify-content-center text-center gap-2 mb-3">
              <a href="https://twitter.com/u369eth" target="blank">
                <img src={twitter} alt="" className="img-fluid icon" />
              </a>
              <a href="https://t.me/+eXB5_gt3wvtlOGE5" target="blank">
                <FaTelegramPlane className="icon" />
              </a>

              <a href="https://www.instagram.com/u369.eth/" target="blank">
                {" "}
                <AiOutlineInstagram className="icon" />
              </a>
              <a href="mailto:u369eth@protonmail.com">
                <MdEmail className="icon" />{" "}
              </a>

              <a href="https://github.com/u369eth" target="blank">
                <AiOutlineGithub className="icon" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
