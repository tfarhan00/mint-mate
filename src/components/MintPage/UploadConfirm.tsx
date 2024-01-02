import { cnm } from "@/utils/style";
import { Transition, Dialog } from "@headlessui/react";
import { useAtom, useAtomValue } from "jotai";
import { Fragment } from "react";
import { imageDataAtom, imageUploadStateAtom } from "./ImageUpload";

function UploadConfirm({ confirmationCallback }: UploadConfirmProps) {
  const [{ isConfirmation }, setImageUploadState] =
    useAtom(imageUploadStateAtom);

  const { rawImage } = useAtomValue(imageDataAtom);

  const closeModal = () => {
    setImageUploadState((prevState) => ({
      ...prevState,
      isConfirmation: false,
    }));
  };

  const formatFilename = (filename: string, maxLength: number = 15) => {
    if (filename.length < maxLength) {
      return filename;
    }

    const lastSixCharacter = filename.length - 6;
    const totalLength = filename.length;
    return (
      filename.slice(0, maxLength) +
      "..." +
      filename.slice(lastSixCharacter, totalLength)
    );
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
                  Upload Confirmation
                </p>
                <p className="font-medium text-black/50 text-center text-balance">
                  You are about to upload{" "}
                  <span className="font-semibold">
                    {rawImage &&
                      typeof rawImage.name === "string" &&
                      formatFilename(rawImage.name)}
                  </span>
                  , make sure you&apos;re uploading the intended file.
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

interface UploadConfirmProps {
  confirmationCallback: () => void;
}

export default UploadConfirm;
