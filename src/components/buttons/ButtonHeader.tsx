"use client";

interface ButtonHeaderProps extends InterfaceButton {}

function ButtonHeader(props: ButtonHeaderProps) {
  const children = props.children;
  const onClick = props.onClick;

  return (
    <button className="header-buttons" onClick={onClick}>
      {children}
    </button>
  );
}

export default ButtonHeader;
