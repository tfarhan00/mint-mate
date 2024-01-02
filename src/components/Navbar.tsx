import Link from "next/link";
import ConnectButton from "./ConnectButton";
import MintModalButton from "./MintModal/MintModalButton";
import { useEffect } from "react";
import { cnm } from "@/utils/style";
import { useRouter } from "next/router";
import { useAtom } from "jotai";
import { navMenuMobileAtom } from "./NavMenuMobile";
import ProfileUserCirlcle from "./ProfileUserCircle";

export default function Navbar() {
  return (
    <div className="w-full py-4 flex justify-center items-center px-5 z-[99] bg-transparent h-20">
      <nav className="md:px-3 w-full max-w-5xl flex items-center justify-between">
        <div className="flex items-center justify-between gap-3 md:gap-8">
          <Link
            href={"/"}
            className="font-bold md:text-2xl text-black font-space tracking-wide"
          >
            MNMT
          </Link>
          <div className="md:flex items-center gap-8 text-sm font-semibold text-black/50 hidden">
            <Link href={"/gallery"}>Gallery</Link>
          </div>
        </div>
        <div className="hidden md:flex items-center gap-4">
          <MintModalButton />
          <ConnectButton />
          <ProfileUserCirlcle />
        </div>

        {/* Mobile */}
        <MobileNav />
      </nav>
    </div>
  );
}

function MobileNav() {
  const [isOpen, setIsOpen] = useAtom(navMenuMobileAtom);
  const route = useRouter();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  }, [isOpen]);

  useEffect(() => {
    setIsOpen(false);
  }, [route.pathname]);

  return (
    <button
      onClick={() => {
        setIsOpen((prev) => !prev);
      }}
      className="w-6 flex flex-col gap-2 relative z-50 md:hidden"
    >
      <span
        className={cnm(
          "w-full h-[3px] bg-black duration-200 transition-transform origin-left",
          isOpen && "rotate-[12deg]"
        )}
      ></span>
      <span
        className={cnm(
          "w-full h-[3px] bg-black duration-200 transition-transform origin-left",
          isOpen && "-rotate-[12deg]"
        )}
      ></span>
    </button>
  );
}
