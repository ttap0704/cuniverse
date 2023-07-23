"use client";

interface ButtonHeaderProps extends InterfaceButton {}

function ButtonHeader(props: ButtonHeaderProps) {
  const children = props.children;
  const onClick = props.onClick;
  const onMouseEnter = props.onMouseEnter;
  const onMouseLeave = props.onMouseLeave;
  const className = props.className;
  const id = props.id;

  return (
    <button
      className={`header-buttons ${className ?? ""}`}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      id={id ?? ""}
    >
      {children}
    </button>
  );
}

export default ButtonHeader;
