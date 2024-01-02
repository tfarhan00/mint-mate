import { useResetMinting } from "@/hooks/use-reset-minting";

export default function MintError() {
  const { resetMintingState } = useResetMinting();

  return (
    <div className="w-full flex flex-col gap-14 items-center">
      <div className="w-full flex flex-col items-center gap-1">
        <h1 className="font-semibold text-2xl ">Error</h1>
        <p className="text-md text-gray-400">
          There is an unexpected error while you&apos;re minting your art.
        </p>
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
  );
}
