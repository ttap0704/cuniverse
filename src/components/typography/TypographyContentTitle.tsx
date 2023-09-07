import { memo } from "react";
import typographyStyles from "@/css/components/typography.module.scss";

interface TypographyContentTitleProps {
  title: string;
}

function TypographyContentTitle(props: TypographyContentTitleProps) {
  const title = props.title;

  return (
    <h1 className={typographyStyles["typography-content-title"]}>{title}</h1>
  );
}

export default memo(TypographyContentTitle, (prev, cur) => {
  return prev.title === cur.title;
});
