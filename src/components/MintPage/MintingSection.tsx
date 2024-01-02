import ProgressBar from "@/components/MintPage/ProgressBar";
import { useAddress, useConnectionStatus, useUser } from "@thirdweb-dev/react";
import { useAtomValue } from "jotai";
import { atomWithStorage } from "jotai/utils";
import DoneMintingCard from "@/components/MintPage/DoneMintingCard";
import { ImageUpload } from "@/components/MintPage/ImageUpload";
import MintingForm from "@/components/MintPage/MintingForm";

export default function MintingSection() {
  const { isLoggedIn, user } = useUser();
  const address = useAddress();
  const status = useConnectionStatus();

  if (!isLoggedIn || !address || !user || status === "disconnected")
    return <SignInWarning />;

  return (
    <div className="w-full min-h-screen py-20 flex flex-col items-center px-5">
      <div className="w-full max-w-5xl flex flex-col items-center gap-24">
        {/* Progress */}
        <ProgressBar />

        {/* Minting process from uploading image to mint the whole metadata*/}
        <MintingStepProcess />
      </div>
    </div>
  );
}

function SignInWarning() {
  return (
    <div className="w-full h-[80vh] flex flex-col items-center justify-center gap-2 px-5">
      <h1 className="font-semibold tracking-tight text-2xl text-center md:text-3xl text-black/30">
        Before you dive into minting, make sure to{" "}
        <span className="text-black items-center inline-flex gap-2">
          connect{" "}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="lucide lucide-wallet-2"
          >
            <path d="M17 14h.01" />
            <path d="M7 7h12a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14" />
          </svg>
        </span>{" "}
        first
      </h1>
    </div>
  );
}

export enum MintingStep {
  Upload,
  Minting,
  Done,
}

export const mintingStepAtom = atomWithStorage<MintingStep>(
  "minting-step",
  MintingStep.Upload
);

function MintingStepProcess() {
  const step = useAtomValue(mintingStepAtom);
  return mintStep(step);
}

function mintStep(step: MintingStep) {
  switch (Number(step)) {
    case MintingStep.Upload:
      return <ImageUpload />;
    case MintingStep.Minting:
      return <MintingForm />;
    case MintingStep.Done:
      return <DoneMintingCard />;
  }
}
