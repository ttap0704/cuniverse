import { HTMLAttributes } from "react";

interface BoxWithTitleProps {
  children: React.ReactNode;
  title: string;
  style?: HTMLAttributes<HTMLElement>["style"];
  className?: string;
}

function BoxWithTitle(props: BoxWithTitleProps) {
  const title = props.title;
  const children = props.children;
  const style = props.style ?? {};
  const className = props.className ?? "";

  return (
    <div className={`box-with-title ${className}`} style={{ ...style }}>
      <h2>{title}</h2>
      {children}
    </div>
  );
}

export default BoxWithTitle;
