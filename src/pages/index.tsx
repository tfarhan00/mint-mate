import Marquee from "@/components/Marquee/Marquee";
import { showcase } from "@/data/showcase-data";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <Head>
        <title>MintMate</title>
      </Head>
      <div className="w-full pb-20">
        <Hero />
      </div>
    </>
  );
}

function Hero() {
  return (
    <div className="w-full pt-28 flex flex-col items-center min-h-screen">
      <div className="flex flex-col items-center gap-4 text-center">
        <p className="font-semibold text-black/50 text-xs md:text-sm">
          CREATE, EXPLORE, & COLLECT DIGITAL ART NFTS.
        </p>
        <h1 className="font-semibold md:tracking-tight text-[40px]">
          Crystalized Passion.
        </h1>
        <Link
          href={"/gallery"}
          className="border px-5 py-2 rounded-full font-medium text-sm md:text-base"
        >
          Explore
        </Link>
      </div>

      <div className="w-full flex items-center gap-5 pt-32 overflow-x-hidden">
        <Marquee>
          {showcase.map((item, idx) => (
            <div
              key={idx}
              className="w-80 h-96 border p-5 shrink-0 rounded-xl relative overflow-hidden"
            >
              <Image
                src={item.src}
                alt={item.name}
                fill
                sizes="500px"
                className="w-full h-full object-cover"
                priority
              />
            </div>
          ))}
        </Marquee>
      </div>
    </div>
  );
}
