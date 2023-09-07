import { memo } from "react";
import typographyStyles from "@/css/components/typography.module.scss";

interface TypographyInputLabelProps {
  id: string;
  labelText: string;
  required?: boolean;
}

function TypographyInputLabel(props: TypographyInputLabelProps) {
  const { id, labelText, required } = props;

  return (
    <label htmlFor={id} className={typographyStyles["typography-input-label"]}>
      {labelText}
      {required ? <span>*</span> : null}
    </label>
  );
}

export default memo(TypographyInputLabel, (prev, cur) => {
  return prev.labelText === cur.labelText;
});
