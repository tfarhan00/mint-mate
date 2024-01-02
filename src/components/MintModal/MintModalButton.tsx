import { isMintModalOpenAtom } from "@/store/mint-modal-store";
import { useSetAtom } from "jotai";

export default function MintModalButton() {
  const setModalOpen = useSetAtom(isMintModalOpenAtom);
  return (
    <button
      onClick={() => {
        setModalOpen(true);
      }}
      className="bg-blue-50 px-5 py-2 text-blue-500 font-medium text-sm rounded-full hover:bg-blue-100"
    >
      Mint
    </button>
  );
}
