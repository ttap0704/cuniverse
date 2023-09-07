"use client";

import { useEffect, useState } from "react";
import TypographyInputLabel from "../typography/TypographyInputLabel";
import inputStyles from "@/css/components/inputs.module.scss";

// 정보 수정 / 추가에 사용되는 Input Component

interface InputDateTimeWithLabelProps {
  id: string;
  date: string;
  labelText: string;
  onChange: (date: number) => void;
}

function InputDateTimeWithLabel(props: InputDateTimeWithLabelProps) {
  const { id, labelText, date, onChange } = props;

  const [value, setValue] = useState("");

  useEffect(() => {
    setValue(date);
  }, [date]);

  const handleDate = (e: React.ChangeEvent<HTMLInputElement>) => {
    const curValue = e.target.value.length == 0 ? 0 : e.target.value;
    onChange(new Date(curValue).getTime());
    setValue(e.target.value);
  };

  return (
    <div className={inputStyles["input-width-label"]}>
      <TypographyInputLabel id={id} labelText={labelText} required={true} />
      <input
        className={inputStyles["input-default"]}
        id={id}
        value={value}
        onChange={handleDate}
        type="datetime-local"
        min={new Date().toISOString().slice(0, 16)}
      />
    </div>
  );
}

export default InputDateTimeWithLabel;
