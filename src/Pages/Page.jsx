import React from "react";
import TokensTable from "./TokensTable";

function Page() {
  return (
    <div className="container text-white">
      <div
        className="d-flex newPageDiv justify-content-center mt-4 "
        style={{ gap: "100px" }}>
        <div className="newPageWidth tablediv ">
          <h5 className="text-start fairDistPadding pb-2">Fair distribution</h5>
          <div
            className="rounded-lg time_box border border-primary boxes"
            style={{ borderRadius: "15px", padding: "30px" }}>
            <div className="col-lg-12 text-start">
              <p>
                Funds sent via this smart contract are distributed as follows:
              </p>

              <p>30% for u369gift.eth to reward u369.eth end-users</p>
              <p>30% for u369impact.eth to fund public goods</p>
              <p>30% for u369.eth to self-sustain the social good</p>
              <p>
                10% for u369community-dev.eth to support the u369.eth Community
                & Developers Benefit Fund
              </p>
            </div>
          </div>
        </div>
        <div className="newPageWidth tablediv">
          <h5 className="text-start pb-2">Tokens to send</h5>
          <TokensTable />
        </div>
      </div>
    </div>
  );
}

export default Page;
