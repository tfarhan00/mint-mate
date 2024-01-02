import { truncateAddress } from "@/utils/strings";
import ConfettiLations from "./ConfettiLations";
import { useAtomValue } from "jotai";
import { imageDataAtom } from "./ImageUpload";
import { MediaRenderer, useUser } from "@thirdweb-dev/react";
import { formDataAtom } from "./MintingForm";
import { useResetMinting } from "@/hooks/use-reset-minting";

export default function DoneMintingCard() {
  const { previewImage } = useAtomValue(imageDataAtom);
  const { name, description } = useAtomValue(formDataAtom);
  const { user } = useUser();
  const { resetMintingState } = useResetMinting();

  return (
    <>
      <div className="w-full flex flex-col gap-14 items-center">
        <div className="w-full flex flex-col items-center gap-1">
          <h1 className="font-semibold text-2xl ">Congratulation</h1>
          <p className="text-md text-gray-400">
            You&apos;ve crystalized your art, it will be marked for so long
            time.
          </p>
        </div>
        <div className="w-full max-w-sm flex flex-col overflow-hidden bg-white rounded-2xl border border-transparent hover:border-black/10 shadow-xl">
          <div className="w-full aspect-square bg-black/10 relative overflow-hidden">
            <MediaRenderer
              src={previewImage}
              alt={name.toString()}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
          </div>

          {/* Desc */}
          <div className="py-5 px-5 flex flex-col items-start gap-4 bg-neutral-50">
            <div className="flex items-center gap-2 text-xs py-1 pl-2 pr-3 rounded-full bg-neutral-200 font-space">
              <div className="w-5 bg-blue-400 rounded-full aspect-square"></div>
              <p>{truncateAddress(user?.address ?? "")}</p>
            </div>
            <div>
              <h1 className="text-xl font-semibold">{name}</h1>
              <p className="text-black/50 text-sm">{description}</p>
            </div>
          </div>
        </div>

        {/* Reset Button */}
        <button
          onClick={resetMintingState}
          className="w-fit bg-black hover:bg-black/75 disabled:bg-neutral-400 duration-200 px-4 py-2 rounded-full text-white font-medium flex items-center justify-center gap-2"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="lucide lucide-rotate-cw"
          >
            <path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8" />
            <path d="M21 3v5h-5" />
          </svg>
          <p>Mint Again</p>
        </button>
      </div>
      <ConfettiLations />
    </>
  );
}
