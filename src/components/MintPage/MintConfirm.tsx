import { cnm } from "@/utils/style";
import { Transition, Dialog } from "@headlessui/react";
import { useAtom } from "jotai";
import { Fragment } from "react";
import { mintStateAtom } from "./MintingForm";

function MintConfirm({ confirmationCallback }: MintConfirmProps) {
  const [{ isConfirmation }, setMintState] = useAtom(mintStateAtom);

  const closeModal = () => {
    setMintState((prevState) => ({
      ...prevState,
      isConfirmation: false,
    }));
  };

  return (
    <Transition appear show={isConfirmation} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={closeModal}>
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
            <div className="w-full max-w-md h-64 bg-white rounded-xl border p-6 flex flex-col">
              <div className="flex flex-col gap-2 items-center w-full py-4">
                <p className="text-xl font-semibold tracking-tight">
                  Are you sure?
                </p>
                <p className="font-medium text-black/50 text-center text-balance">
                  You are about to mint your art to our collections and minting
                  process is irreversible.
                </p>
              </div>
              <div className="w-full flex items-center justify-center gap-2 text-sm mt-auto">
                <button
                  onClick={() => {
                    closeModal();
                  }}
                  className={cnm(
                    "border-red-500 text-red-500 flex-1 max-w-sm rounded-lg py-2.5 px-5 flex items-center justify-center",
                    "transition-colors duration-200 hover:bg-red-50"
                  )}
                >
                  Cancel
                </button>
                <button
                  onClick={confirmationCallback}
                  className="bg-blue-500 text-white flex-1 rounded-lg py-2.5 px-5 flex items-center justify-center hover:bg-blue-600"
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        </Transition.Child>
      </Dialog>
    </Transition>
  );
}

interface MintConfirmProps {
  confirmationCallback: () => void;
}

export default MintConfirm;
