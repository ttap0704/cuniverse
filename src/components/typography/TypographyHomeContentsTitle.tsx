import { memo } from "react";

interface TypographyHomeContentsTitleProps {
  title: string;
}

function TypographyHomeContentsTitle(props: TypographyHomeContentsTitleProps) {
  const title = props.title;

  return <h2 className="typography-content-title home">{title}</h2>;
}

export default memo(TypographyHomeContentsTitle, (prev, cur) => {
  return prev.title === cur.title;
});
