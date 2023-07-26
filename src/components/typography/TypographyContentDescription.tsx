import { memo, useEffect } from "react";

interface TypographyContentDescriptionProps {
  description: string;
}

function TypographyContentDescription(
  props: TypographyContentDescriptionProps
) {
  const description = props.description;

  return <p className="typography-content-description">{description}</p>;
}

export default memo(TypographyContentDescription, (prev, cur) => {
  return prev.description === cur.description;
});
