"use client";

import { useState } from "react";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";
import buttonStyles from "@/css/components/buttons.module.scss";
// "더보기" 기능에 사용되는 Button

interface ButtonSeeMoreProps {
  onClick: (view: boolean) => void;
}

function ButtonSeeMore(props: ButtonSeeMoreProps) {
  const onClick = props.onClick;

  const [view, setView] = useState(false);

  const handleButton = () => {
    onClick(!view);
    setView(!view);
  };

  return (
    <button
      id="button-see-more"
      className={buttonStyles["button-see-more"]}
      onClick={handleButton}
    >
      {!view ? <FiChevronDown /> : <FiChevronUp />}
    </button>
  );
}

export default ButtonSeeMore;
