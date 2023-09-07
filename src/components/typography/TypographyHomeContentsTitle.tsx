import { memo } from "react";
import typographyStyles from "@/css/components/typography.module.scss";

interface TypographyHomeContentsTitleProps {
  title: string;
}

function TypographyHomeContentsTitle(props: TypographyHomeContentsTitleProps) {
  const title = props.title;

  return (
    <h2
      className={`${typographyStyles["typography-content-title"]} ${typographyStyles["home"]}`}
    >
      {title}
    </h2>
  );
}

export default memo(TypographyHomeContentsTitle, (prev, cur) => {
  return prev.title === cur.title;
});
