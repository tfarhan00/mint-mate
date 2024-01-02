import { useResetMinting } from "@/hooks/use-reset-minting";
import { truncateAddress } from "@/utils/strings";
import { ConnectWallet, useAddress } from "@thirdweb-dev/react";

export default function ConnectButton() {
  const userAddress = useAddress();
  const { resetMintingState } = useResetMinting();

  return (
    <ConnectWallet
      theme={"light"}
      modalSize={"compact"}
      style={{
        padding: "10px 20px 10px 20px",
        fontSize: 14,
        borderRadius: 9999,
        minWidth: "auto",
      }}
      switchToActiveChain={true}
      modalTitle="Connect"
      btnTitle="Connect"
      modalTitleIconUrl={""}
      detailsBtn={() => (
        <button className="text-sm bg-neutral-100 rounded-full px-3 py-2 flex items-center gap-2 font-medium text-black/50 hover:bg-neutral-200">
          <div className="w-2 aspect-square rounded-full bg-green-300"></div>
          <p>{truncateAddress(userAddress ?? "")}</p>
        </button>
      )}
      auth={{
        loginOptional: false,
        onLogout() {
          resetMintingState();
        },
      }}
    />
  );
}
