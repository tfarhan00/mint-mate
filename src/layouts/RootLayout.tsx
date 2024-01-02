import NewUserSetup from "@/components/NewUser/NewUserSetup";
import Footer from "@/components/Footer";
import MintModal from "@/components/MintModal/MintModal";
import NavMenuMobile from "@/components/NavMenuMobile";
import Navbar from "@/components/Navbar";
import { PropsWithChildren } from "react";
import TransferModal from "@/components/ProfilePage/TransferModal";

export default function RootLayout(props: PropsWithChildren) {
  return (
    <>
      <Navbar />
      {props.children}
      <Footer />

      {/* Global component */}
      <MintModal />
      <NavMenuMobile />
      <NewUserSetup />
      <TransferModal />
    </>
  );
}
