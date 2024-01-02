import { truncateAddress } from "@/utils/strings";
import {
  MediaRenderer,
  useAddress,
  useConnectionStatus,
  useContract,
  useStorage,
  useUser,
} from "@thirdweb-dev/react";
import { useRouter } from "next/router";
import { cnm } from "@/utils/style";
import { User } from "@prisma/client";
import { useCallback, useEffect, useState } from "react";
import { NFTData } from "../GalleryPage/GallerySection";
import { READ_CONTRACT } from "@/constant/contract";
import { BigNumber } from "ethers";
import { useSetAtom } from "jotai";
import { transferStateAtom } from "./TransferModal";
import { OPENSEA_TESTNET_URL } from "@/constant/URL";

export default function ProfileSection() {
  const { user, isLoggedIn } = useUser();
  const router = useRouter();
  const address = useAddress();
  const status = useConnectionStatus();
  const [ownedNfts, setOwnedNfts] = useState<NFTData[] | undefined>(undefined);

  const { contract } = useContract(
    process.env.NEXT_PUBLIC_THIRDWEB_SMART_CONTRACT
  );

  const storage = useStorage();

  useEffect(() => {
    if (status === "disconnected") {
      router.push("/");
    }
  }, [status]);

  const data = JSON.parse((user?.data ?? "{}") as string) as User;

  const getAllNFT = useCallback(async () => {
    if (!contract || !storage || !address) return;

    const callTotalIdCounter = (await contract.call(
      READ_CONTRACT._tokenIdCounter
    )) as BigNumber;

    // convert BigNumber to number
    const totalNfts = callTotalIdCounter.toNumber();

    // generate array based on balanceOf() with keys as tokenId
    const generatedArray = [...Array(totalNfts).keys()];

    // fetch all NFT from contract
    const nfts = generatedArray.map(async (tokenId) => {
      const callTokenURI = await contract.call(READ_CONTRACT.tokenURI, [
        tokenId,
      ]);
      const callOwnerOf = await contract.call(READ_CONTRACT.ownerOf, [tokenId]);

      const ipfsURI = callTokenURI;
      const ownerAddress = callOwnerOf;

      if (address !== ownerAddress) return [];

      const metadata = await storage.downloadJSON(ipfsURI);

      const finalMetadata = {
        ...metadata,
        id: tokenId,
        ownerAddress,
      } satisfies NFTData;

      return finalMetadata as NFTData;
    });

    const finalNfts = await Promise.all(nfts);
    const flatFinalNfts = finalNfts.flatMap((item) => item);

    setOwnedNfts(flatFinalNfts);
  }, [contract]);

  useEffect(() => {
    getAllNFT();
  }, [contract]);

  if (!user) return null;

  return (
    <div className="w-full flex flex-col items-center py-20 px-5">
      <div className="w-full flex flex-col max-w-5xl">
        <div className="flex flex-col gap-4 pb-14">
          <div
            className={cnm(
              "w-16 md:w-24 aspect-square rounded-full",
              "bg-gradient-to-tr from-violet-400 to-violet-500"
            )}
          ></div>
          <div className="flex items-start flex-col gap-4">
            <div className="flex items-start gap-3  flex-wrap">
              <p className="text-2xl font-space">
                {truncateAddress(user?.address ?? "")}
              </p>
              {data.name && (
                <p className="font-medium px-4 py-2 bg-neutral-100 rounded-full text-sm">
                  @{data.name}
                </p>
              )}
            </div>
            <a
              href={`${OPENSEA_TESTNET_URL}/${user.address}`}
              target="_blank"
              className="font-medium px-2 py-2 bg-[#2081E2] hover:bg-[#2081E2]/80 rounded-full text-sm text-white flex items-center gap-1.5"
            >
              <div>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 360 360"
                  fill="none"
                >
                  <g clipPath="url(#clip0_3_69)">
                    <g clipPath="url(#clip1_3_69)">
                      <path
                        d="M181.566 1.00604e-05C80.91 -0.82799 -0.82799 80.91 1.00604e-05 181.566C0.84601 279.306 80.694 359.172 178.416 359.982C279.072 360.846 360.846 279.072 359.982 178.416C359.172 80.712 279.306 0.84601 181.566 1.00604e-05ZM127.746 89.586C139.266 104.22 146.16 122.742 146.16 142.83C146.16 160.236 140.994 176.436 132.12 189.954H69.714L127.728 89.568L127.746 89.586ZM318.006 199.242V212.202C318.006 213.048 317.556 213.768 316.782 214.092C312.552 215.892 298.602 222.372 292.788 230.436C277.812 251.28 266.382 284.04 240.822 284.04H134.172C96.408 284.04 64.818 254.07 64.836 214.146C64.836 213.156 65.682 212.346 66.672 212.346H117.216C118.962 212.346 120.33 213.75 120.33 215.46V225.216C120.33 230.4 124.524 234.612 129.726 234.612H168.066V212.292H141.876C156.942 193.212 165.906 169.128 165.906 142.902C165.906 113.652 154.692 86.976 136.332 67.032C147.438 68.328 158.058 70.542 168.066 73.476V67.266C168.066 60.822 173.286 55.602 179.73 55.602C186.174 55.602 191.394 60.822 191.394 67.266V82.242C227.178 98.946 250.614 126.666 250.614 158.022C250.614 176.418 242.568 193.536 228.69 207.936C226.026 210.69 222.336 212.256 218.466 212.256H191.412V234.54H225.378C232.704 234.54 245.844 220.644 252.072 212.274C252.072 212.274 252.342 211.86 253.062 211.644C253.782 211.428 315.432 197.28 315.432 197.28C316.728 196.92 318.006 197.91 318.006 199.224V199.242Z"
                        fill="white"
                      />
                    </g>
                  </g>
                  <defs>
                    <clipPath id="clip0_3_69">
                      <rect width="360" height="360" fill="white" />
                    </clipPath>
                    <clipPath id="clip1_3_69">
                      <rect width="360" height="360" fill="white" />
                    </clipPath>
                  </defs>
                </svg>
              </div>
              <p>OpenSea</p>
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
                className="lucide lucide-arrow-up-right"
              >
                <path d="M7 7h10v10" />
                <path d="M7 17 17 7" />
              </svg>
            </a>
          </div>
        </div>

        <div className="flex flex-col items-start w-full">
          <p className="font-medium text-sm md:text-base bg-neutral-100 px-4 py-2 rounded-full">
            Owned NFTs
          </p>
          <div className="w-full py-12">
            <div className="w-full">
              <>
                {ownedNfts !== undefined ? (
                  <>
                    {ownedNfts.length > 0 ? (
                      <div className="w-full grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {ownedNfts.map((item) => (
                          <UserOwnedNFTCard
                            key={item.id}
                            data={{
                              id: item.id,
                              name: item.name,
                              description: item.description,
                              image: item.image,
                              ownerAddress: item.ownerAddress,
                            }}
                          />
                        ))}
                      </div>
                    ) : (
                      <UserOwnedNotFound />
                    )}
                  </>
                ) : (
                  <div className="w-full grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[...Array(6).keys()].map((item) => (
                      <UserOwnedSkeleton key={item} />
                    ))}
                  </div>
                )}
              </>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

interface NFT {
  data: NFTData;
}

function UserOwnedNFTCard(props: NFT) {
  const data = props.data;
  const setTransferState = useSetAtom(transferStateAtom);

  const transferIntentCallback = () => {
    setTransferState((prevState) => ({
      ...prevState,
      isIntentTransfer: true,
      selectedItem: {
        ...prevState.selectedItem,
        id: data.id,
        name: data.name?.toString() ?? "",
        description: data.description ?? "",
        image: data.image ?? "",
        ownerAddress: data.ownerAddress ?? "",
      },
    }));
  };

  return (
    <div className="w-full flex flex-col overflow-hidden bg-white rounded-2xl border border-transparent hover:border-black/10">
      <div className="w-full aspect-square bg-black/10 relative overflow-hidden">
        <MediaRenderer
          src={data.image}
          alt={data.name?.toString()}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
      </div>

      {/* Desc */}
      <div className="py-5 px-5 flex flex-col items-start gap-4 bg-neutral-50 grow">
        <div className="w-full flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs py-1 pl-2 pr-3 rounded-full bg-neutral-200 font-space">
            <div className="w-5 bg-blue-400 rounded-full aspect-square"></div>
            <p>{truncateAddress(data.ownerAddress ?? "")}</p>
          </div>
          <button
            onClick={transferIntentCallback}
            className="border px-3 py-1 text-sm rounded-full flex items-center gap-2 text-neutral-400 hover:bg-neutral-200 hover:text-neutral-600"
          >
            <p>Transfer</p>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-send"
            >
              <path d="m22 2-7 20-4-9-9-4Z" />
              <path d="M22 2 11 13" />
            </svg>
          </button>
        </div>
        <div>
          <h1 className="text-xl font-semibold">
            {data.name === "" ? data.id : data.name}
          </h1>
          <p className="text-black/50 text-sm">
            {data.description === ""
              ? "No description provided"
              : data.description}
          </p>
        </div>
      </div>
    </div>
  );
}

function UserOwnedSkeleton() {
  return (
    <div className="w-full flex flex-col overflow-hidden bg-white rounded-2xl border border-transparent animate-pulse">
      {/* Image Container */}
      <div className="w-full aspect-square bg-black/10 relative overflow-hidden"></div>

      {/* Desc Container */}
      <div className="py-5 px-5 flex flex-col items-start gap-4 bg-neutral-100 grow">
        {/* Owner Address */}
        <div className="flex items-center gap-2 text-xs py-1 pl-2 pr-3 rounded-full bg-neutral-200 font-space">
          <div className="w-5 bg-blue-400 rounded-full aspect-square"></div>
          <div className="w-20 bg-gray-300 rounded-full h-4"></div>
        </div>

        {/* Title and Description */}
        <div className="flex flex-col gap-2">
          <div className="text-xl font-semibold bg-gray-300 h-5 w-24 rounded"></div>
          <div className="text-black/50 text-sm bg-gray-300 h-5 w-36 rounded"></div>
        </div>
      </div>
    </div>
  );
}

function UserOwnedNotFound() {
  return (
    <div className="w-full h-96 flex items-center justify-center font-medium text-xl">
      <p>No matching NFTs found.</p>
    </div>
  );
}
