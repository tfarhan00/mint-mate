import { cnm } from "@/utils/style";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { imageDataAtom } from "./ImageUpload";
import {
  MediaRenderer,
  useContract,
  useStorageUpload,
  useUser,
} from "@thirdweb-dev/react";
import MintConfirm from "./MintConfirm";
import { z } from "zod";
import { MintingStep, mintingStepAtom } from "./MintingSection";
import { atomWithStorage } from "jotai/utils";
import { WRITE_CONTRACT } from "@/constant/contract";
import { useState } from "react";
import MintError from "./MintError";

const metadataSchema = z.object({
  image: z.string(),
  description: z.string().min(1),
  name: z.string().min(1),
  external_url: z.string().url().optional(),
});

export const mintStateAtom = atomWithStorage("minting-process", {
  isConfirmation: false,
  isMinting: false,
  total: 10,
  progress: 0,
});

export const metadataUploadStateAtom = atomWithStorage(
  "metadata-upload-process",
  {
    isUploading: false,
    total: 10,
    progress: 0,
  }
);

export const formDataAtom = atomWithStorage<{
  name: string;
  description: string;
  external_url: string | undefined;
}>("form-data", {
  name: "",
  description: "",
  external_url: undefined,
});

export default function MintingForm() {
  const { contract } = useContract(
    process.env.NEXT_PUBLIC_THIRDWEB_SMART_CONTRACT
  );

  // IPFS metadata upload
  const { mutateAsync: upload } = useStorageUpload({
    uploadWithoutDirectory: false,
    onProgress: (progress) => {
      setMetadataUploadState((prevState) => ({
        ...prevState,
        ...progress,
      }));
    },
  });

  const { user } = useUser();

  const imageData = useAtomValue(imageDataAtom);
  const [formData, setFormData] = useAtom(formDataAtom);
  const [mintState, setMintState] = useAtom(mintStateAtom);
  const [metadataUploadState, setMetadataUploadState] = useAtom(
    metadataUploadStateAtom
  );
  const setMintingStep = useSetAtom(mintingStepAtom);
  const [errorMinting, setErrorMinting] = useState(false);

  // Mint NFT
  const mintConfirmCallback = async () => {
    if (!user || !contract) return;

    const metadata = {
      image: imageData.previewImage,
      name: formData.name,
      description: formData.description,
      external_url: formData.external_url,
    };

    setMintState((prevState) => ({
      ...prevState,
      isConfirmation: false,
    }));

    setMetadataUploadState((prevState) => ({
      ...prevState,
      isUploading: true,
    }));

    // Upload metadata to IPFS
    const metadataIpfsURI = await upload({
      data: [metadata],
    });

    setMetadataUploadState((prevState) => ({
      ...prevState,
      isUploading: false,
    }));

    // Initialize Minting Process
    setMintState((prevState) => ({
      ...prevState,
      isConfirmation: false,
      isMinting: true,
    }));

    // Minting the NFT with receipent and the metadata URI
    await contract
      .call(WRITE_CONTRACT.mintNFT, [user.address, metadataIpfsURI[0]])
      .then(() => {
        setMintState((prevState) => ({
          ...prevState,
          isMinting: false,
          progress: prevState.total,
        }));
        setMintingStep(MintingStep.Done);
      })
      .catch((e) => {
        if (process.env.NODE_ENV === "production") return;
        console.error(e);
        setErrorMinting(true);
      });
  };

  const handleSubmitButton = () => {
    // Checks metadata validity
    const metadata = {
      image: imageData.previewImage,
      name: formData.name,
      description: formData.description,
      external_url: formData.external_url,
    };

    const metadataParseResult = metadataSchema.safeParse(metadata);

    if (!metadataParseResult.success) {
      return;
    }

    setMintState((prevState) => ({
      ...prevState,
      isConfirmation: true,
    }));
  };

  if (errorMinting) {
    return <MintError />;
  }

  if (metadataUploadState.isUploading) {
    return <MetadataUploadProgress />;
  }

  if (mintState.isMinting) {
    return <MintingProgress />;
  }

  return (
    <>
      <MintConfirm confirmationCallback={mintConfirmCallback} />
      <div className="w-full flex flex-col md:flex-row justify-between gap-6">
        <div className="flex-1 border rounded-xl relative overflow-hidden">
          <MediaRenderer
            src={imageData.previewImage ?? ""}
            className="w-full h-full object-cover relative"
            alt="preview-image"
            style={{
              width: "100%",
              height: "100%",
            }}
          />
          <div className="absolute top-5 left-5 bg-blue-50 text-blue-500 rounded-full pl-2 pr-3 py-1 text-sm font-medium flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-box"
            >
              <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
              <path d="m3.3 7 8.7 5 8.7-5" />
              <path d="M12 22V12" />
            </svg>
            <p>Uploaded to IPFS</p>
          </div>
        </div>
        <div className="flex-1 flex flex-col items-start gap-8">
          {/* Name */}
          <div className="flex flex-col gap-2 w-full">
            <p className="font-medium">
              Name <span className="text-red-400">*</span>
            </p>
            <div
              className={cnm(
                "w-full border rounded-lg bg-neutral-50 overflow-hidden py-2 px-4"
              )}
            >
              <input
                onChange={(e) => {
                  const value = e.target.value;
                  setFormData((prevState) => ({ ...prevState, name: value }));
                }}
                placeholder="e.g Damn Cool Cat"
                className="bg-transparent outline-none placeholder:text-sm w-full"
              />
            </div>
          </div>

          {/* Desc */}
          <div className="flex flex-col gap-2 w-full ">
            <p className="font-medium">
              Description <span className="text-red-400">*</span>
            </p>
            <div
              className={cnm(
                "w-full border rounded-lg bg-neutral-50 overflow-hidden"
              )}
            >
              <textarea
                onChange={(e) => {
                  const value = e.target.value;
                  setFormData((prevState) => ({
                    ...prevState,
                    description: value,
                  }));
                }}
                placeholder="What's your description?"
                className="bg-transparent outline-none placeholder:text-sm h-64 p-4 w-full resize-none"
              />
            </div>
          </div>

          {/* External URL */}
          <div className="flex flex-col gap-2 w-full ">
            <p className="font-medium">External URL</p>
            <div className="w-full border rounded-lg bg-neutral-50 overflow-hidden py-2 px-4">
              <input
                onChange={(e) => {
                  const value = e.target.value;
                  setFormData((prevState) => ({
                    ...prevState,
                    external_url: value,
                  }));
                }}
                placeholder="e.g. https://external-url.com"
                className="bg-transparent outline-none placeholder:text-sm w-full"
              />
            </div>
          </div>

          <button
            onClick={handleSubmitButton}
            className={cnm(
              "w-full flex items-center justify-center py-3 text-white bg-black rounded-full hover:bg-black/80 ",
              "duration-200 transition-colors"
            )}
          >
            Mint NFT
          </button>
        </div>
      </div>
    </>
  );
}

function MetadataUploadProgress() {
  return (
    <div className="w-full flex flex-col items-center">
      <div className="w-full flex flex-col items-center gap-1">
        <h1 className="font-semibold text-2xl ">Uploading metadata to IPFS</h1>
        <p className="text-md text-gray-400">Please wait...</p>
      </div>
    </div>
  );
}

function MintingProgress() {
  return (
    <div className="w-full flex flex-col items-center">
      <div className="w-full flex flex-col items-center gap-1">
        <h1 className="font-semibold text-2xl ">Minting your Art</h1>
        <p className="text-md text-gray-400">
          Please wait while we&apos;re minting your art, it will be quick.
        </p>
      </div>
    </div>
  );
}
