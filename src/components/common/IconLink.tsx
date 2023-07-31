import { clearTooltipAtom, setTooltipAtom } from "@/store/tooltip";
import { useSetAtom } from "jotai";
import Link from "next/link";
import { useRef } from "react";

interface IconLinkProps {
  href: string;
  icon: React.ReactNode;
  tooltipText: string;
  target?: "_blank" | "_self";
}

function IconLink(props: IconLinkProps) {
  const href = props.href;
  const icon = props.icon;
  const tooltipText = props.tooltipText;
  const target = props.target;

  const setTooltip = useSetAtom(setTooltipAtom);
  const clearTooltip = useSetAtom(clearTooltipAtom);

  const iconRef = useRef<null | HTMLAnchorElement>(null);

  return (
    <Link
      ref={iconRef}
      href={href}
      target={target ?? "_blank"}
      className="icon-link"
      onMouseEnter={() =>
        setTooltip({
          open: true,
          text: tooltipText,
          targetElement: iconRef.current,
        })
      }
      onMouseLeave={clearTooltip}
    >
      {icon}
    </Link>
  );
}

export default IconLink;
