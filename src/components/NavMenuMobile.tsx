import { cnm } from "@/utils/style";
import { atom, useAtomValue } from "jotai";
import MintModalButton from "./MintModal/MintModalButton";
import ConnectButton from "./ConnectButton";
import Link from "next/link";

export const navMenuMobileAtom = atom(false);

export default function NavMenuMobile() {
  const isOpen = useAtomValue(navMenuMobileAtom);

  return (
    <div
      className={cnm(
        "fixed w-full h-full inset-0 translate-x-[100%] bg-white z-40 duration-300 transition-transform",
        isOpen && "translate-x-[0%]"
      )}
    >
      <div className="w-full h-full flex flex-col p-5 justify-between">
        <div className="flex flex-col gap-4 font-medium text-2xl pt-20">
          <Link href="/gallery">Gallery</Link>
        </div>

        <div className="flex flex-col gap-4 items-end">
          <MintModalButton />
          <ConnectButton />
        </div>
      </div>
    </div>
  );
}
