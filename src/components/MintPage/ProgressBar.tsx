import { useAtomValue } from "jotai";
import { imageUploadStateAtom } from "./ImageUpload";
import { cnm } from "@/utils/style";
import { MintingStep, mintingStepAtom } from "./MintingSection";
import { metadataUploadStateAtom, mintStateAtom } from "./MintingForm";
import { clamp } from "@/utils/number";

export default function ProgressBar() {
  const imageUploadProgress = useAtomValue(imageUploadStateAtom);
  const uploadProgressPercentage =
    (imageUploadProgress.progress / imageUploadProgress.total) * 100;
  const mintProgress = useAtomValue(mintStateAtom);
  const metadataUploadProgress = useAtomValue(metadataUploadStateAtom);

  const metadataUploadProgressPercentage =
    (metadataUploadProgress.progress / metadataUploadProgress.total) * 100;
  const mintProgressPercentage =
    (mintProgress.progress / mintProgress.total) * 100;

  const totalMintPercentage =
    clamp(metadataUploadProgressPercentage, 0, 50) +
    clamp(mintProgressPercentage, 0, 50);

  const mintingStep = useAtomValue(mintingStepAtom);

  return (
    <div className="w-full max-w-2xl flex flex-col">
      <div className="w-full flex items-center justify-between relative">
        {/* 0% (Upload IPFS) */}
        <div className="w-full flex items-center justify-between gap-3 z-10 absolute font-medium text-xs md:text-sm">
          <div
            className={cnm(
              "text-white rounded-full px-4 py-2 bg-[length:200%]",
              "w-14 md:w-20 flex items-center justify-center transition-colors duration-300",
              mintingStep >= MintingStep.Upload
                ? "bg-gradient-to-tr from-rose-400 via-fuchsia-500 to-indigo-500"
                : "bg-neutral-100 text-black/50"
            )}
          >
            Upload
          </div>
          {/* Upload process bar */}
          <div className=" h-[3px] grow bg-neutral-100 rounded-full overflow-hidden">
            <div
              id="progress"
              style={{
                width: `${uploadProgressPercentage}%`,
              }}
              className="w-0 h-full bg-gradient-to-r from-rose-400 via-fuchsia-500 to-indigo-500 transition-all duration-200 ease-in-out"
            ></div>
          </div>

          <div
            className={cnm(
              "text-white rounded-full px-4 py-2 bg-[length:200%]",
              "w-14 md:w-20 flex items-center justify-center transition-colors duration-300",
              mintingStep >= MintingStep.Minting
                ? "bg-gradient-to-tr from-rose-400 via-fuchsia-500 to-indigo-500"
                : "bg-neutral-100 text-black/50"
            )}
          >
            Mint
          </div>

          {/* Minting process bar */}
          <div className=" h-[3px] grow bg-neutral-100 rounded-full overflow-hidden">
            <div
              id="progress"
              style={{
                width: `${totalMintPercentage}%`,
              }}
              className="w-0 h-full bg-gradient-to-r from-rose-400 via-fuchsia-500 to-indigo-500 transition-all duration-200 ease-in-out"
            ></div>
          </div>

          <div
            className={cnm(
              "text-white rounded-full px-4 py-2 bg-[length:200%]",
              "w-14 md:w-20 flex items-center justify-center transition-colors duration-300",
              mintingStep === MintingStep.Done
                ? "bg-gradient-to-tr from-rose-400 via-fuchsia-500 to-indigo-500"
                : "bg-neutral-100 text-black/50"
            )}
          >
            Done
          </div>
        </div>
      </div>
    </div>
  );
}
