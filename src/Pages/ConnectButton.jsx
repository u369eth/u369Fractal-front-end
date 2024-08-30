// import { ConnectKitButton } from "connectkit";

// const ConnectBtn = () => {
//   return (
//     <div className="bg-transparent border  border-primary rounded-pill border-1 text-white fw-bold ">
//       <ConnectKitButton />
//     </div>
//   );
// };

// export default ConnectBtn;
import { useWeb3Modal } from "@web3modal/wagmi/react";

const ConnectBtn = () => {
  // 4. Use modal hook
  const { open } = useWeb3Modal();

  return (
    <div className="bg-transparent border  border-primary rounded-pill border-1 text-white fw-bold ">
      <w3m-button balance="hide" />
    </div>
  );
};

export default ConnectBtn;
