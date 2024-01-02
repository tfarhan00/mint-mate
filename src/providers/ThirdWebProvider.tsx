import {
  ThirdwebProvider,
  metamaskWallet,
  coinbaseWallet,
  walletConnect,
  localWallet,
  en,
} from "@thirdweb-dev/react";
import { PropsWithChildren } from "react";

export default function ThirdWebProvider(props: PropsWithChildren) {
  return (
    <ThirdwebProvider
      activeChain={Number(process.env.NEXT_PUBLIC_THIRDWEB_ACTIVE_CHAIN)}
      clientId={process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID}
      locale={en()}
      supportedWallets={[
        metamaskWallet({ recommended: true }),
        coinbaseWallet(),
        walletConnect(),
        localWallet(),
      ]}
      autoConnect
      authConfig={{
        domain: process.env.NEXT_PUBLIC_THIRDWEB_AUTH_DOMAIN,
        authUrl: "/api/auth",
      }}
    >
      {props.children}
    </ThirdwebProvider>
  );
}
