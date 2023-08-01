import { PropsWithChildren } from "react";

interface BoxWhiteProps extends PropsWithChildren {
  title?: string;
}

function BoxWhite(props: BoxWhiteProps) {
  const children = props.children;
  const title = props.title;

  return (
    <div className="box-white">
      {title ? <h3></h3> : null}
      {children}
    </div>
  );
}

export default BoxWhite;
