import { isMintModalOpenAtom } from "@/store/mint-modal-store";
import { Dialog, Transition } from "@headlessui/react";
import { useAtom } from "jotai";
import Image from "next/image";
import { Fragment, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";

export default function MintModal() {
  let [isOpen, setIsOpen] = useAtom(isMintModalOpenAtom);
  const route = useRouter();

  function closeModal() {
    setIsOpen(false);
  }

  useEffect(() => {
    closeModal();
  }, [route.pathname]);

  return (
    <>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog
          as="div"
          className="z-[99] w-screen h-screen fixed inset-0"
          onClose={closeModal}
        >
          <div className="w-full h-full relative">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="absolute inset-0 bg-black/40 backdrop-blur-xl" />
            </Transition.Child>

            <div className="flex h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white transition-all">
                  <div className="flex flex-col w-full">
                    <div className="bg-gradient-to-b from-black to-neutral-800 relative h-80 w-full p-5 flex justify-end items-start">
                      <div className="w-full absolute inset-0">
                        <Image
                          src={"/single-cube.webp"}
                          alt="single-mint"
                          className="w-full h-full object-cover"
                          fill
                          sizes="400px"
                        />
                      </div>

                      <button
                        onClick={closeModal}
                        className="w-10 flex items-center justify-center rounded-full aspect-square relative text-white bg-white/20 backdrop-blur-lg"
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

                    <div className="w-full h-full p-5 text-black relative flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <svg
                          width="24px"
                          height="24px"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 16 16"
                        >
                          <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M9.592.427a3.185 3.185 0 0 0-3.184 0l-4.17 2.407A3.185 3.185 0 0 0 .645 5.592v4.816c0 1.137.607 2.189 1.593 2.758l4.17 2.407c.985.57 2.199.57 3.184 0l4.17-2.407a3.185 3.185 0 0 0 1.593-2.758V5.592c0-1.137-.607-2.189-1.593-2.758L9.592.427Zm1.359 6.312a.696.696 0 0 0-.021-.986.7.7 0 0 0-.989.021L7.126 8.708 6.082 7.504a.7.7 0 0 0-.985-.07.696.696 0 0 0-.072.983L6.571 10.2a.7.7 0 0 0 1.034.026l3.346-3.487Z"
                            fill="currentColor"
                          ></path>
                        </svg>
                        <p>NFT</p>
                      </div>
                      <Link
                        href={"/mint/nft"}
                        className="bg-black px-5 py-2 text-white font-medium rounded-full flex items-center gap-2 hover:bg-black/80"
                      >
                        Mint
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="lucide lucide-plus"
                        >
                          <path d="M5 12h14" />
                          <path d="M12 5v14" />
                        </svg>
                      </Link>
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}
