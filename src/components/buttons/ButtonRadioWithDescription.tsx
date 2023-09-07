import { memo } from "react";
import buttonStyles from "@/css/components/buttons.module.scss";

interface ButtonRadioWithDescription extends ButtonRadioInterface {
  onChange: () => void;
}

function ButtonRadioWithDescription(props: ButtonRadioWithDescription) {
  const { title, description, checked, id, onChange } = props;
  return (
    <label
      className={buttonStyles["button-radio-with-description"]}
      htmlFor={id}
    >
      <div>
        <h3>{title}</h3>
        <span>{description}</span>
      </div>
      <input type="radio" id={id} checked={checked} onChange={onChange} />
    </label>
  );
}

export default memo(ButtonRadioWithDescription, (prev, cur) => {
  return prev.checked === cur.checked;
});
