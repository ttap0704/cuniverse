import { PropsWithChildren } from "react";

function ContainerForm(props: PropsWithChildren) {
  const children = props.children;

  return (
    <div className="container-form">
      <div>{children}</div>
      <button>저장</button>
    </div>
  );
}

export default ContainerForm;
