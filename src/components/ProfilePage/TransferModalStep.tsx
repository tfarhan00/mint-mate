import { useAtom, useAtomValue } from "jotai";
import { ChangeEventHandler, forwardRef, useState } from "react";
import { TransferNFTStep, transferStateAtom } from "./TransferModal";
import { cnm } from "@/utils/style";
import { MediaRenderer, useContract } from "@thirdweb-dev/react";
import { z } from "zod";
import { ethers } from "ethers";
import { WRITE_CONTRACT } from "@/constant/contract";
import Link from "next/link";
import { RESET } from "jotai/utils";
import Spinner from "../Loader/Spinner";
import { MUMBAI_EXPLORER_URL } from "@/constant/URL";

const TransferSteps = forwardRef<HTMLDivElement>(function TransferSteps(
  props,
  forwardedRef
) {
  const transferStepsState = useAtomValue(transferStateAtom);

  if (transferStepsState.transferStep === TransferNFTStep.TransferAddress)
    return <ToAddressStep {...props} forwardedRef={forwardedRef} />;
  if (transferStepsState.transferStep === TransferNFTStep.TransferConfirmation)
    return <TransferConfirmationStep {...props} forwardedRef={forwardedRef} />;
  if (transferStepsState.transferStep === TransferNFTStep.TransferCompleted)
    return <TransferCompletedStep {...props} forwardedRef={forwardedRef} />;
  return <div ref={forwardedRef}></div>;
});

function ToAddressStep({ forwardedRef }: BaseTransferStepComponentProps) {
  const [{ selectedItem, transferTo }, setTransferState] =
    useAtom(transferStateAtom);
  const [validationError, setValidatonError] =
    useState<BaseTransferFormValidation>({ isError: false, errorMessage: "" });

  const addressSchema = z
    .string()
    .min(1, {
      message: "Field cannot be empty",
    })
    .refine((value) => ethers.utils.isAddress(value), {
      message: "Invalid address",
    });

  const handleInputChange: ChangeEventHandler<HTMLInputElement> = async (
    event
  ) => {
    const parseAddrses = await addressSchema.safeParseAsync(event.target.value);
    if (!parseAddrses.success) {
      setValidatonError((prevState) => ({
        ...prevState,
        isError: true,
        errorMessage: parseAddrses.error.issues[0].message,
      }));
      return;
    }

    setValidatonError({ isError: false, errorMessage: "" });
    setTransferState((prevState) => ({
      ...prevState,
      transferTo: event.target.value,
    }));
  };

  const nextStep = async () => {
    const parseAddrses = await addressSchema.safeParseAsync(transferTo);
    if (!parseAddrses.success) {
      setValidatonError((prevState) => ({
        ...prevState,
        isError: true,
        errorMessage: parseAddrses.error.issues[0].message,
      }));
      return;
    }

    setTransferState((prevState) => ({
      ...prevState,
      transferStep: prevState.transferStep + 1,
    }));
  };

  return (
    <>
      <div className="flex flex-col gap-4 items-center w-full h-full py-4">
        <div className="flex flex-col gap-2 items-center">
          <p className="text-xl font-semibold tracking-tight">Transfer</p>
          <p className="font-medium text-black/50 text-center text-balance">
            Transfer your {`"${selectedItem.name}"`}
          </p>
        </div>
        {/* Preview Selected */}
        <div className="w-full aspect-square bg-black/10 relative overflow-hidden">
          <MediaRenderer
            src={selectedItem.image}
            alt="Preview Image"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
        </div>
        {/* Input */}
        <div className="flex flex-col w-full gap-2">
          <div
            className={cnm(
              "w-full border rounded-lg overflow-hidden py-2 px-4 mt-auto",
              validationError.isError ? "bg-red-100" : "bg-neutral-50"
            )}
          >
            <input
              onChange={handleInputChange}
              placeholder="Transfer to 0x249b"
              className="bg-transparent outline-none placeholder:text-sm w-full"
            />
          </div>
          <p className="text-red-500 text-xs">{validationError.errorMessage}</p>
        </div>
      </div>
      <div className="w-full flex items-stretch justify-center gap-2 text-sm mt-auto">
        <button
          onClick={nextStep}
          disabled={validationError.isError}
          className="bg-black disabled:bg-gray-500 font-bold tracking-wide text-white flex-1 rounded-lg py-2.5 px-5 flex items-center justify-center hover:bg-black/80"
        >
          Transfer
        </button>
      </div>
    </>
  );
}

function TransferConfirmationStep({
  forwardedRef,
}: BaseTransferStepComponentProps) {
  const { contract } = useContract(
    process.env.NEXT_PUBLIC_THIRDWEB_SMART_CONTRACT
  );
  const [{ isTransferring, transferTo, selectedItem }, setTransferState] =
    useAtom(transferStateAtom);
  const [error, setError] = useState(false);

  const confirmTransferCallback = async () => {
    if (!contract) return;
    try {
      // Update tranferstatus
      setTransferState((prevState) => ({
        ...prevState,
        isTransferring: true,
      }));

      // Start Transfer
      const safeTransferFrom = await contract.call(
        WRITE_CONTRACT.safeTransferFrom,
        [selectedItem.ownerAddress, transferTo, selectedItem.id]
      );

      if (typeof safeTransferFrom !== "object") {
        throw new Error("safeTransferFrom from must return object.");
      }

      if (!safeTransferFrom.hasOwnProperty("receipt")) {
        throw new Error(
          "safeTransferFrom object must contain 'receipt' key property."
        );
      }

      // Finished
      setTransferState((prevState) => ({
        ...prevState,
        transferStep: prevState.transferStep + 1,
        transactionId: safeTransferFrom.receipt.transactionHash,
      }));
    } catch (err: any) {
      if (err instanceof Error) {
        setTransferState((prevState) => ({
          ...prevState,
          isTransferring: false,
        }));
        setError(true);
      }
    }
  };

  return (
    <>
      <div className="flex flex-col gap-4 items-center w-full h-full py-4">
        <div className="flex flex-col gap-2 items-center">
          <p className="text-xl font-semibold tracking-tight">Transfer</p>
          <p className="font-medium text-black/50 text-center text-balance">
            {isTransferring
              ? "Check your wallet, you will be asked to confirm your transfer."
              : "Transfers sent to wrong address cannot be recovered, check twicely before you confirm."}
          </p>
        </div>
      </div>
      <div className="w-full flex flex-col items-stretch justify-center gap-2 text-sm mt-auto">
        {!isTransferring ? (
          <button
            onClick={confirmTransferCallback}
            className="bg-blue-500 hover:bg-blue-600 duration-200 flex-1 text-white font-semibold self-stretch rounded-lg py-2.5 px-5 flex items-center justify-center mt-auto"
          >
            {error ? "Retry" : "Confirm"}
          </button>
        ) : (
          <div className="w-full flex justify-center py-2.5">
            <Spinner className="fill-black" />
          </div>
        )}
      </div>
    </>
  );
}

function TransferCompletedStep({
  forwardedRef,
}: BaseTransferStepComponentProps) {
  const [{ transactionId, transferTo, selectedItem }, setTransferState] =
    useAtom(transferStateAtom);

  const finishCallback = () => {
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
      <div className="flex flex-col gap-4 items-center w-full h-full py-4">
        <div className="flex flex-col gap-2 items-center">
          <p className="text-xl font-semibold tracking-tight">
            Transfer Completed
          </p>
          <p className="font-medium text-black/50 text-center text-balance">
            {`"${selectedItem.name}" has been transferred to ${transferTo.slice(
              0,
              8
            )}`}
          </p>
          <Link
            href={`${MUMBAI_EXPLORER_URL}/tx/${transactionId}`}
            rel="noopener noreferrer"
            target="_blank"
            className="text-sm text-violet-400 underline underline-offset-4"
          >
            Transaction Id: {transactionId.slice(0, 12)}
          </Link>
        </div>
      </div>
      <div className="w-full flex items-stretch justify-center gap-2 text-sm mt-auto">
        <button
          onClick={finishCallback}
          className="bg-blue-500 hover:bg-blue-600 duration-200 text-white self-stretch flex-1 font-semibold rounded-lg py-2.5 px-5 flex items-center justify-center mt-auto"
        >
          Finish
        </button>
      </div>
    </>
  );
}

interface BaseTransferStepComponentProps {
  forwardedRef: React.ForwardedRef<HTMLDivElement>;
}

interface BaseTransferFormValidation {
  isError: boolean;
  errorMessage: string;
}

export default TransferSteps;
