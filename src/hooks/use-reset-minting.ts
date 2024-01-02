import {
  imageDataAtom,
  imageUploadStateAtom,
} from "@/components/MintPage/ImageUpload";
import {
  formDataAtom,
  metadataUploadStateAtom,
  mintStateAtom,
} from "@/components/MintPage/MintingForm";
import { mintingStepAtom } from "@/components/MintPage/MintingSection";
import { useSetAtom } from "jotai";
import { RESET } from "jotai/utils";

export function useResetMinting() {
  const resetFormData = useSetAtom(formDataAtom);
  const resetImageData = useSetAtom(imageDataAtom);
  const resetImageUpload = useSetAtom(imageUploadStateAtom);
  const resetMintingStep = useSetAtom(mintingStepAtom);
  const resetMintingProcess = useSetAtom(mintStateAtom);
  const resetMetadataUploadProcess = useSetAtom(metadataUploadStateAtom);

  const resetMintingState = () => {
    resetMintingProcess(RESET);
    resetMintingStep(RESET);
    resetFormData(RESET);
    resetImageData(RESET);
    resetImageUpload(RESET);
    resetMetadataUploadProcess(RESET);
  };

  return {
    resetMintingState,
  };
}
