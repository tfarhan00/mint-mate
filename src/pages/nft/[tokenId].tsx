import { NFTData } from "@/components/GalleryPage/GallerySection";
import { READ_CONTRACT } from "@/constant/contract";
import { truncateAddress } from "@/utils/strings";
import { MediaRenderer, useContract, useStorage } from "@thirdweb-dev/react";
import { FastAverageColor } from "fast-average-color";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";

export default function SingleNftPage() {
  const router = useRouter();
  const tokenId = router.query.tokenId as string;
  const [data, setData] = useState<NFTData>();
  const imageRef = useRef<HTMLImageElement>(null);
  const [avgColor, setAvgColor] = useState<any>();

  const { contract } = useContract(
    process.env.NEXT_PUBLIC_THIRDWEB_SMART_CONTRACT
  );
  const storage = useStorage();

  const getSingleNFT = async () => {
    if (!contract || !storage) return;
    const callTokenURI = await contract.call(READ_CONTRACT.tokenURI, [tokenId]);
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
  };

  useEffect(() => {
    const getNFT = async () => {
      const nft = await getSingleNFT();
      setData(nft);
    };

    getNFT();
  }, []);

  useEffect(() => {
    const image = imageRef.current;
    if (!image) return;
    const fac = new FastAverageColor();

    if (data) {
      const imgSrc = image.getAttribute("src");
      fac.getColorAsync(imgSrc as any).then((color) => {
        setAvgColor(color);
      });
    }
  }, [data]);

  return (
    <>
      <Head>
        <title>
          {" "}
          {data?.name === "" ? data.id : data?.name} - {data?.id} | MintMate
        </title>
      </Head>
      <div className="min-h-screen pb-20 w-full flex flex-col items-center">
        {/* Container */}
        <div className="w-full flex flex-col items-center -mt-20 z-0 pointer-events-none">
          {/* Image Showcase Card */}
          <div
            style={{
              background: `rgba(${avgColor?.value[0]},${avgColor?.value[1]},${avgColor?.value[2]},0.2)`,
            }}
            className="w-full flex items-center justify-center pb-20 pt-28 transition-colors duration-500 ease-in-out px-5"
          >
            {/* Image Container */}
            <div className="w-full max-w-md aspect-square overflow-hidden pointer-events-auto">
              {data ? (
                <MediaRenderer
                  ref={imageRef as any}
                  src={data.image}
                  alt={data.name?.toString()}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "contain",
                  }}
                />
              ) : (
                <div className="animate-pulse bg-gray-300 w-full h-full"></div>
              )}
            </div>
          </div>
          {/* Metadata Container */}
          <div className="w-full max-w-7xl flex flex-col md:flex-row justify-between items-start gap-8 md:gap-16 px-5 py-6 md:py-16">
            {/* Owner Address */}

            {/* Item Name and ID */}
            <div className="flex flex-col items-start gap-10 flex-1">
              <div className="text-3xl md:text-4xl xl:text-5xl font-medium">
                {data ? (
                  <div className="flex flex-col gap-5">
                    <span className="inline-flex text-neutral-400 text-4xl">
                      #{data.id.padStart(2, "0")}
                    </span>
                    {data.name === "" ? data.id : <>{data.name} </>}
                  </div>
                ) : (
                  <div className="animate-pulse bg-gray-300 w-40 h-10 rounded"></div>
                )}
              </div>
              <div className="flex items-center gap-2">
                <p className="font-medium text-lg text-neutral-400">Owned by</p>
                <div className="flex items-center gap-3 bg-neutral-100 rounded-full pl-2 pr-3 py-1.5 text-sm">
                  {data ? (
                    <>
                      <div className="w-5 bg-gradient-to-tr from-blue-500 to-blue-600 aspect-square rounded-full"></div>
                      <p>{truncateAddress(data.ownerAddress ?? "")}</p>
                    </>
                  ) : (
                    <div className="animate-pulse bg-gray-300 w-24 h-4 rounded-full"></div>
                  )}
                </div>
              </div>
            </div>

            {/* Item Description */}
            <div className="flex-1 flex-col flex gap-6 border rounded-xl p-5">
              {/* Desc */}
              <div className="flex flex-col gap-4">
                <div className="font-medium text-xl">Description</div>
                <div className="text-neutral-400">
                  {data ? (
                    <>
                      {data.description === ""
                        ? "No description provided"
                        : data.description}
                    </>
                  ) : (
                    <div className="animate-pulse bg-gray-300 w-80 h-8 rounded"></div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
