import { memo } from "react";

interface TypographyInputLabelProps {
  id: string;
  labelText: string;
  required?: boolean;
}

function TypographyInputLabel(props: TypographyInputLabelProps) {
  const { id, labelText, required } = props;

  return (
    <label htmlFor={id} className="typography-input-label">
      {labelText}
      {required ? <span>*</span> : null}
    </label>
  );
}

export default memo(TypographyInputLabel, (prev, cur) => {
  return prev.labelText === cur.labelText;
});
