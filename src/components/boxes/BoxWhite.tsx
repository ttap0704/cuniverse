import { HTMLAttributes, PropsWithChildren } from "react";

interface BoxWhiteProps extends PropsWithChildren {
  title?: string;
  className?: string;
  style?: HTMLAttributes<HTMLDivElement>["style"];
}

function BoxWhite(props: BoxWhiteProps) {
  const children = props.children;
  const title = props.title;
  const className = props.className;
  const style = props.style ?? {};

  return (
    <div className={`box-white ${className ?? ""}`} style={{ ...style }}>
      {title ? <h3></h3> : null}
      {children}
    </div>
  );
}

export default BoxWhite;
