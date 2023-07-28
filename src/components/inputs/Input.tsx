"use client";

import React, { useEffect, useState } from "react";

function Input(props: InputProps) {
  const id = props.id;
  const type = props.type;
  const defaultValue = props.value;
  const validation = props.validation;

  const [value, setValue] = useState<string | number>("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleInputValue = (e: React.ChangeEvent) => {
    const event = e as React.ChangeEvent<HTMLInputElement>;
    const curValue = event.target.value;
    let tmpErrorMessage = "";

    if (validation) tmpErrorMessage = validation(curValue);

    if (tmpErrorMessage.length != 0) {
      if (tmpErrorMessage.length == 0) setErrorMessage(tmpErrorMessage);
      setValue(curValue);
    } else {
      if (tmpErrorMessage.length != 0) setErrorMessage("");
    }
  };

  useEffect(() => {
    setValue(defaultValue);
  }, [defaultValue]);

  if (type === "textarea") {
    return (
      <textarea
        className="input-default"
        id={id}
        value={value}
        onChange={handleInputValue}
      />
    );
  } else {
    return (
      <input
        className="input-default"
        id={id}
        value={value}
        onChange={handleInputValue}
      />
    );
  }
}

export default Input;
