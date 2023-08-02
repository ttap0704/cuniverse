"use client";

// Header Component에 사용되는 버튼 정의

interface ButtonHeaderProps extends InterfaceButton {}

function ButtonHeader(props: ButtonHeaderProps) {
  const children = props.children;
  const onClick = props.onClick;
  const onMouseEnter = props.onMouseEnter;
  const onMouseLeave = props.onMouseLeave;
  const className = props.className;
  const id = props.id;
  const testid = props.testid;

  return (
    <button
      className={`header-buttons ${className ?? ""}`}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      id={id ?? ""}
      data-testid={testid ?? ""}
    >
      {children}
    </button>
  );
}

export default ButtonHeader;
