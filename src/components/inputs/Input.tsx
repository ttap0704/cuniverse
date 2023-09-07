"use client";

import { setDropdownAtom } from "@/store/dropdown";
import { useSetAtom } from "jotai";
import React, { memo, useEffect, useState } from "react";
import DropdownMenu from "../dropdowns/DropdownMenu";
import inputStyles from "@/css/components/inputs.module.scss";

function Input(props: InputProps) {
  const id = props.id;
  const type = props.type;
  const dataKey = props.dataKey;
  const defaultValue = props.value;
  const onChange = props.onChange;
  const validation = props.validation;
  const readOnly = props.readOnly || type === "dropdown";
  const placeholder = props.placeholder;
  const items = props.items;
  const direct = props.direct;

  const setDropdown = useSetAtom(setDropdownAtom);

  const [value, setValue] = useState<StringOrNumber>("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleInputValue = (e: React.ChangeEvent) => {
    const event = e as React.ChangeEvent<HTMLInputElement>;
    const curValue = event.target.value;
    let tmpErrorMessage = "";

    if (validation) {
      tmpErrorMessage = validation(curValue);
    }

    if (tmpErrorMessage.length != 0) {
      if (errorMessage.length == 0) setErrorMessage(tmpErrorMessage);
    } else {
      if (errorMessage.length != 0) setErrorMessage("");
    }

    if (direct) onChange(curValue, tmpErrorMessage.length != 0);
    else setValue(curValue);
  };

  useEffect(() => {
    setValue(defaultValue);
  }, [defaultValue]);

  const handleInputChange = () => {
    if (readOnly) return;

    onChange(value, errorMessage.length != 0);
  };

  const openDropdownMenu = () => {
    if (type === "dropdown" && items) {
      setDropdown({ open: true, id });
    }
  };

  const checkItem = (id: StringOrNumber) => {
    if (items) {
      const checked = items.find((item) => item.id == id);
      if (checked) {
        setValue(checked.label);
        onChange(checked.id, false);
      }
    }
  };

  const errorElement =
    errorMessage.length == 0 ? null : (
      <span
        className={inputStyles["input-error-message"]}
        id={`input-error-message-${dataKey}`}
      >
        {errorMessage}
      </span>
    );

  if (type === "textarea") {
    return (
      <>
        <textarea
          className={`${inputStyles["input-default"]} ${
            inputStyles["textarea"]
          } ${errorMessage.length != 0 ? inputStyles["error"] : ""}`}
          id={id}
          value={value}
          onChange={handleInputValue}
          onBlur={handleInputChange}
          aria-invalid={true}
          aria-errormessage={`input-error-message-${dataKey}`}
          readOnly={readOnly ?? false}
          placeholder={placeholder}
        />
        {errorElement}
      </>
    );
  } else {
    return (
      <>
        <input
          className={`${inputStyles["input-default"]} ${
            errorMessage.length != 0 ? inputStyles["error"] : ""
          } ${type == "dropdown" ? inputStyles["dropdown"] : ""}`}
          id={id}
          value={value}
          onChange={handleInputValue}
          onBlur={handleInputChange}
          onClick={openDropdownMenu}
          aria-invalid={true}
          aria-errormessage={`input-error-message-${dataKey}`}
          readOnly={readOnly ?? false}
          placeholder={placeholder}
          type={type === "dropdown" ? "text" : type}
        />

        {errorElement}
        <DropdownMenu
          items={items ?? []}
          onItemClicked={checkItem}
          targetId={id}
        />
      </>
    );
  }
}

export default memo(Input, (prev, cur) => {
  return prev.value === cur.value;
});
