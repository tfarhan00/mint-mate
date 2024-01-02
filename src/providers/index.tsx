import { PropsWithChildren } from "react";
import ThirdWebProvider from "./ThirdWebProvider";
import { Provider as JotaiProvider } from "jotai";

export default function Providers(props: PropsWithChildren) {
  return (
    <JotaiProvider>
      <ThirdWebProvider>{props.children}</ThirdWebProvider>
    </JotaiProvider>
  );
}
