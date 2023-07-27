import { memo } from "react";

interface TypographyContentTitleProps {
  title: string;
}

function TypographyContentTitle(props: TypographyContentTitleProps) {
  const title = props.title;

  return <h1 className="typography-content-title">{title}</h1>;
}

export default memo(TypographyContentTitle, (prev, cur) => {
  return prev.title === cur.title;
});
