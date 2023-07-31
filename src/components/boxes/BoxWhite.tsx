import { PropsWithChildren } from "react";

function BoxWhite(props: PropsWithChildren) {
  const children = props.children;

  return <div className="box-white">{children}</div>;
}

export default BoxWhite;
