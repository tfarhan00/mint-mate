import { PropsWithChildren } from "react";
import style from "./Marquee.module.css";
import { cnm } from "@/utils/style";

export default function Marquee(props: PropsWithChildren) {
  return (
    <div className={style.marquee}>
      <div className={cnm(style.marquee__content, style.scroll)}>
        {props.children}
      </div>
      <div
        className={cnm(style.marquee__content, style.scroll)}
        aria-hidden="true"
      >
        {props.children}
      </div>
    </div>
  );
}
