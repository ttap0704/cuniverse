import { PropsWithChildren, memo } from "react";
import BoxWhite from "./BoxWhite";

interface BoxPageIntroProps extends PropsWithChildren {
  title: string;
}

function BoxPageIntro(props: BoxPageIntroProps) {
  const title = props.title;
  const children = props.children;

  return (
    <BoxWhite className="box-page-intro">
      <h1>{title}</h1>
      <p>{children}</p>
    </BoxWhite>
  );
}

export default memo(BoxPageIntro, (prev, cur) => {
  return prev.title === cur.title;
});
