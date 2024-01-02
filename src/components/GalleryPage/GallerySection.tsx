import {
  MediaRenderer,
  NFTMetadata,
  useContract,
  useStorage,
} from "@thirdweb-dev/react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { truncateAddress } from "@/utils/strings";
import Link from "next/link";
import { READ_CONTRACT } from "@/constant/contract";
import { type BigNumber } from "ethers";
import { useDebounce } from "usehooks-ts";

export type NFTData = Pick<
  NFTMetadata,
  "name" | "description" | "image" | "id"
> & {
  ownerAddress: string | undefined;
};

export default function GallerySection() {
  const { contract } = useContract(
    process.env.NEXT_PUBLIC_THIRDWEB_SMART_CONTRACT
  );

  const storage = useStorage();
  const [data, setData] = useState<NFTData[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");

  const getAllNFT = useCallback(async () => {
    if (!contract || !storage) return;

    const callTotalIdCounter = (await contract.call(
      READ_CONTRACT._tokenIdCounter
    )) as BigNumber;

    const totalNfts = callTotalIdCounter.toNumber();

    // Generate array based on _totalIdCounter with keys as tokenId
    const generatedArray = [...Array(totalNfts).keys()];

    // Fetch all NFT from contract
    const nfts = generatedArray.map(async (tokenId) => {
      const callTokenURI = await contract.call(READ_CONTRACT.tokenURI, [
        tokenId,
      ]);
      const callOwnerOf = await contract.call(READ_CONTRACT.ownerOf, [tokenId]);

      const ipfsURI = callTokenURI;
      const ownerAddress = callOwnerOf;
      const metadata = await storage.downloadJSON(ipfsURI);

      const finalMetadata = {
        ...metadata,
        id: tokenId,
        ownerAddress,
      } satisfies NFTData;

      return finalMetadata as NFTData;
    });

    const finalNfts = await Promise.all(nfts);
    setData(finalNfts);
  }, [contract]);

  useEffect(() => {
    getAllNFT();
  }, [contract]);

  // Debounce the search query
  const debouncedSearchQuery = useDebounce(searchQuery, 400);

  // Filter data based on the debounced search query
  const filteredData = useMemo(
    () =>
      data.filter((item) =>
        item.name
          ?.toString()
          .toLowerCase()
          .includes(debouncedSearchQuery.toLowerCase())
      ),
    [data, debouncedSearchQuery]
  );

  return (
    <div className="min-h-screen py-20 w-full flex flex-col items-center px-5">
      <div className="w-full max-w-5xl flex flex-col">
        <div className="w-full flex flex-col md:flex-row gap-5 items-start md:items-center justify-between pb-10">
          <h1 className="font-semibold text-2xl md:text-3xl">Gallery</h1>
          <div className="border rounded-full px-6 w-full max-w-xs">
            <input
              placeholder="Browse NFT..."
              className="outline-none bg-transparent w-full placeholder:font-medium placeholder:text-sm py-2"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        <>
          {data.length > 0 ? (
            <>
              {filteredData.length > 0 ? (
                <div className="w-full grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredData.map((item) => (
                    <GalleryCard
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
                <GalleryCardNotFound />
              )}
            </>
          ) : (
            <div className="w-full grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6).keys()].map((item) => (
                <GalleryCardSkeleton key={item} />
              ))}
            </div>
          )}
        </>
      </div>
    </div>
  );
}

interface NFT {
  data: NFTData;
}

function GalleryCard(props: NFT) {
  const data = props.data;

  return (
    <Link
      href={`/nft/${data.id}`}
      className="w-full flex flex-col overflow-hidden bg-white rounded-2xl border border-transparent hover:border-black/10"
    >
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
      <div className="py-5 px-5 flex flex-col items-start gap-4 bg-neutral-100 grow">
        <div className="flex items-center gap-2 text-xs py-1 pl-2 pr-3 rounded-full bg-neutral-200 font-space">
          <div className="w-5 bg-blue-400 rounded-full aspect-square"></div>
          <p>{truncateAddress(data.ownerAddress ?? "")}</p>
        </div>
        <div className="flex flex-col gap-1">
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
    </Link>
  );
}

function GalleryCardSkeleton() {
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

function GalleryCardNotFound() {
  return (
    <div className="w-full h-96 flex items-center justify-center font-medium text-xl">
      <p>No matching NFTs found.</p>
    </div>
  );
}
