import { Transition, Dialog } from "@headlessui/react";
import { atom, useAtom } from "jotai";
import { Fragment, useEffect } from "react";
import { cnm } from "@/utils/style";
import TransferSteps from "./TransferModalStep";
import { NFTData } from "../GalleryPage/GallerySection";
import { RESET, atomWithReset } from "jotai/utils";

export enum TransferNFTStep {
  TransferAddress,
  TransferConfirmation,
  TransferCompleted,
}

interface TransferStateAtomType {
  isIntentTransfer: boolean;
  isTransferring: boolean;
  selectedItem: {
    id: string;
    name: string;
    description: string;
    image: string;
    ownerAddress: string;
  };
  transferStep: TransferNFTStep;
  transferTo: string;
  transactionId: string;
}

export const transferStateAtom = atomWithReset<TransferStateAtomType>({
  isIntentTransfer: false,
  isTransferring: false,
  selectedItem: {
    id: "",
    name: "",
    description: "",
    image: "",
    ownerAddress: "",
  },
  transferStep: 0,
  transferTo: "",
  transactionId: "",
});

function TransferModal() {
  const [transferState, setTransferState] = useAtom(transferStateAtom);

  const closeIntent = () => {
    setTransferState((prevState) => ({
      ...prevState,
      isIntentTransfer: false,
    }));

    // Delay state reset to prevent animation interrupt
    setTimeout(() => {
      setTransferState(RESET);
    }, 250);
  };

  return (
    <>
      <Transition appear show={transferState.isIntentTransfer} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={closeIntent}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 z-50 bg-black/30 w-screen h-screen flex items-center justify-center px-5">
              <div className="w-full max-w-md min-h-64 h-fit bg-white rounded-xl border p-6 flex flex-col relative">
                {transferState.transferStep < 2 &&
                  !transferState.isTransferring && (
                    <button
                      onClick={closeIntent}
                      className="w-10 flex items-center absolute top-6 right-6 justify-center rounded-full aspect-square  text-black hover:bg-black/10 duration-200 backdrop-blur-lg"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="lucide lucide-x"
                      >
                        <path d="M18 6 6 18" />
                        <path d="m6 6 12 12" />
                      </svg>
                    </button>
                  )}
                <TransferSteps />
              </div>
            </div>
          </Transition.Child>
        </Dialog>
      </Transition>
    </>
  );
}

export default TransferModal;
