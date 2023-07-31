"use client";

import React, { memo, useEffect, useState } from "react";

function Input(props: InputProps) {
  const id = props.id;
  const type = props.type;
  const dataKey = props.dataKey;
  const defaultValue = props.value;
  const onChange = props.onChange;
  const validation = props.validation;

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

    setValue(curValue);
  };

  useEffect(() => {
    setValue(defaultValue);
  }, [defaultValue]);

  const errorElement =
    errorMessage.length == 0 ? null : (
      <span
        className="input-error-message"
        id={`input-error-message-${dataKey}`}
      >
        {errorMessage}
      </span>
    );

  if (type === "textarea") {
    return (
      <>
        <textarea
          className={`input-default textarea ${
            errorMessage.length != 0 ? "error" : ""
          }`}
          id={id}
          value={value}
          onChange={handleInputValue}
          onBlur={() => onChange(value, errorMessage.length != 0)}
          aria-invalid={true}
          aria-errormessage={`input-error-message-${dataKey}`}
        />
        {errorElement}
      </>
    );
  } else {
    return (
      <>
        <input
          className={`input-default ${errorMessage.length != 0 ? "error" : ""}`}
          id={id}
          value={value}
          onChange={handleInputValue}
          onBlur={() => onChange(value, errorMessage.length != 0)}
          aria-invalid={true}
          aria-errormessage={`input-error-message-${dataKey}`}
        />
        {errorElement}
      </>
    );
  }
}

export default memo(Input, (prev, cur) => {
  return prev.value === cur.value;
});
