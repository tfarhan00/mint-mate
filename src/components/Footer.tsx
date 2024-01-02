import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full flex flex-col items-center justify-center border-t pt-8 px-5">
      <div className="w-full max-w-5xl flex flex-col md:flex-row gap-12 justify-between py-12">
        <div className="flex flex-col gap-6">
          <Link
            href={"/"}
            className="font-bold font-space text-xl md:text-3xl text-gray-700"
          >
            Mintmate
          </Link>
          <h1 className="md:text-2xl">Crystalized Passion.</h1>
        </div>
        <div className="flex flex-col gap-6">
          <h1 className="font-medium">Pages</h1>
          <Link href={"/gallery"} className="font-medium text-sm text-black/50">
            Gallery
          </Link>
          <Link href={"/"} className="font-medium text-sm text-black/50">
            Mint
          </Link>
        </div>
      </div>
      <div className="w-full max-w-5xl flex flex-col md:flex-row gap-4 items-center justify-between py-8 border-t text-xs font-medium text-black/50">
        <p>© 2023 MintMate. All rights reserved</p>
        <div className="px-2 py-1 flex items-center gap-2 border rounded-full">
          <div className="bg-green-300 w-2 aspect-square rounded-full"></div>
          <p className="font-space">status: operational</p>
        </div>
      </div>
    </footer>
  );
}
