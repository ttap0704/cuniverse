"use client";

import { clearTooltipAtom, setTooltipAtom } from "@/store/tooltip";
import { useSetAtom } from "jotai";
import Link from "next/link";
import { HTMLAttributes, useRef } from "react";
import commonStyles from "@/css/components/common.module.scss";

// Icon과 함께 사용되는 Link Component

interface IconLinkProps {
  href: string;
  icon: React.ReactNode;
  tooltipText: string;
  target?: "_blank" | "_self";
  style?: HTMLAttributes<HTMLDivElement>["style"];
}

function IconLink(props: IconLinkProps) {
  const href = props.href;
  const icon = props.icon;
  const tooltipText = props.tooltipText;
  const target = props.target;
  const style = props.style;

  // Tooltip에 사용되는 Atom
  const setTooltip = useSetAtom(setTooltipAtom);
  const clearTooltip = useSetAtom(clearTooltipAtom);

  const iconRef = useRef<null | HTMLAnchorElement>(null);

  return (
    <Link
      ref={iconRef}
      href={href}
      target={target ?? "_blank"}
      className={commonStyles["icon-link"]}
      style={style}
      onMouseEnter={() =>
        setTooltip({
          open: true,
          text: tooltipText,
          targetElement: iconRef.current,
        })
      }
      onMouseLeave={clearTooltip}
      onClick={clearTooltip}
    >
      {icon}
    </Link>
  );
}

export default IconLink;
