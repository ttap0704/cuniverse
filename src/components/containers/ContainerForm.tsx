import { PropsWithChildren } from "react";

function ContainerForm(props: PropsWithChildren) {
  const children = props.children;

  return (
    <div className="container-form">
      <div>{children}</div>
    </div>
  );
}

export default ContainerForm;
