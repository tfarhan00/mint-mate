"use client";

import { cnm } from "@/utils/style";
import { useAtom, useSetAtom } from "jotai";
import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import UploadConfirm from "./UploadConfirm";
import { useStorageUpload } from "@thirdweb-dev/react";
import { atomWithStorage } from "jotai/utils";
import { MintingStep, mintingStepAtom } from "./MintingSection";

export const imageDataAtom = atomWithStorage<{
  previewImage: string | null;
  rawImage: File | null;
}>("image-data-preview", {
  previewImage: null,
  rawImage: null,
});

// Track image upload state, not image data.
export const imageUploadStateAtom = atomWithStorage("image-upload-process", {
  isConfirmation: false,
  isUploading: false,
  total: 5,
  progress: 0,
});

export function ImageUpload() {
  const [imageData, setImageData] = useAtom(imageDataAtom);
  const [{ isUploading }, setUploadState] = useAtom(imageUploadStateAtom);
  const setMintingStep = useSetAtom(mintingStepAtom);

  const onDrop = useCallback(<T extends File>(acceptedFiles: T[]) => {
    const file = acceptedFiles[0];
    const url = URL.createObjectURL(file);

    if (!(file instanceof File) && typeof file !== "object") {
      throw new Error("Error with file parse");
    }

    setImageData({
      previewImage: url,
      rawImage: file,
    });
  }, []);

  const removeImage = () => {
    setImageData({
      previewImage: null,
      rawImage: null,
    });
  };

  const { getRootProps, getInputProps, isDragActive, fileRejections } =
    useDropzone({
      onDrop,
      accept: {
        "image/*": [".jpeg", ".png", ".gif"],
        "video/*": [".mp4"],
      },
      maxSize: 20 * 1000000, // 20 MB
      validator: nameLengthValidator,
    });

  // useDropzone validator

  function nameLengthValidator<T extends File>(file: T) {
    if (file.name.length > 40) {
      return {
        code: "name-too-long",
        message: "File name cannot be longer than 40 characters.",
      };
    }

    return null;
  }

  // Rejected reason paragraph component
  const fileRejected = fileRejections.map(({ file, errors }) => (
    <p key={file.name} className="text-sm text-red-400 mt-4">
      {errors.map((e) => e.message.toString())}
    </p>
  ));

  // IPFS Upload Hook
  const { mutateAsync: upload } = useStorageUpload({
    uploadWithoutDirectory: false,
    onProgress: (progress) => {
      setUploadState((prevState) => ({
        ...prevState,
        ...progress,
      }));
    },
  });

  const UploadConfirmCallback = async () => {
    // Close Confirmation Modal
    setUploadState((prevState) => ({ ...prevState, isConfirmation: false }));

    // Uploading file to IPFS
    try {
      setUploadState((prevState) => ({ ...prevState, isUploading: true }));
      const ipfsUpload = await upload({
        data: [imageData.rawImage],
      });
      if (ipfsUpload) {
        setUploadState((prevState) => ({ ...prevState, isUploading: false }));
        setImageData((prevState) => ({
          ...prevState,
          previewImage: ipfsUpload[0],
        }));
        setMintingStep(MintingStep.Minting);
      }
    } catch (err: any) {}
  };

  if (isUploading) {
    return <UploadProgress />;
  }

  return (
    <>
      <UploadConfirm confirmationCallback={UploadConfirmCallback} />
      <div className="w-full flex flex-col items-center">
        <div className="w-full max-w-md flex flex-col justify-between ">
          <div
            {...getRootProps()}
            className={cnm(
              "flex-1 border-dashed bg-neutral-50 aspect-square rounded-t-xl  flex items-center",
              "justify-center text-neutral-500 transition-colors duration-300 overflow-hidden relative group",
              "hover:bg-neutral-100",
              isDragActive && "bg-blue-50 text-blue-500",
              !imageData.previewImage ? "border-x-2 border-t-2" : ""
            )}
          >
            <input
              {...getInputProps({})}
              id="dropzone-file"
              type="file"
              className="hidden w-full h-full relative"
            />

            {/* Upload Label or Image Preview */}
            {imageData.previewImage ? (
              <>
                <div className="w-full h-full relative z-0">
                  <img
                    src={imageData.previewImage}
                    alt={"image for NFT"}
                    className="w-full h-full object-cover"
                  />
                </div>
              </>
            ) : (
              <UploadLabel />
            )}

            {imageData.previewImage ? (
              <div className="w-full h-full bg-black/20 opacity-0 transition-opacity duration-300 flex flex-col p-6 items-end absolute inset-0 group-hover:opacity-100">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeImage();
                  }}
                  className="w-10 aspect-square rounded-full bg-white items-center justify-center flex"
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
              </div>
            ) : null}
          </div>
          <button
            onClick={() => {
              setUploadState((prevState) => ({
                ...prevState,
                isConfirmation: true,
              }));
            }}
            disabled={!imageData.previewImage}
            className="w-full bg-black hover:bg-black/75 disabled:bg-neutral-400 duration-200 px-5 py-5 rounded-b-xl text-white font-medium flex items-center justify-center"
          >
            Upload
          </button>
        </div>
        {fileRejected}
      </div>
    </>
  );
}

function UploadProgress() {
  return (
    <div className="w-full flex flex-col items-center">
      <div className="w-full flex flex-col items-center gap-1">
        <h1 className="font-semibold text-2xl ">Uploading media to IPFS</h1>
        <p className="text-md text-gray-400">Please wait...</p>
      </div>
    </div>
  );
}

function UploadLabel() {
  return (
    <div className="flex flex-col items-center justify-center w-full h-full cursor-pointer">
      <div className="flex flex-col items-center justify-center pt-5 pb-6">
        <svg
          className="w-8 h-8 mb-4"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 20 16"
        >
          <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
          />
        </svg>
        <p className="mb-2 text-sm">
          <span className="font-semibold">Click to upload</span> or drag and
          drop
        </p>
        <p className="text-xs">SVG, PNG, JPG, GIF or MP4 (MAX. 20 MB)</p>
      </div>
    </div>
  );
}
