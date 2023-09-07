import { memo } from "react";
import typographyStyles from "@/css/components/typography.module.scss";

interface TypographyContentDescriptionProps {
  description: string;
}

function TypographyContentDescription(
  props: TypographyContentDescriptionProps
) {
  const description = props.description;

  return (
    <p className={typographyStyles["typography-content-description"]}>
      {description}
    </p>
  );
}

export default memo(TypographyContentDescription, (prev, cur) => {
  return prev.description === cur.description;
});
