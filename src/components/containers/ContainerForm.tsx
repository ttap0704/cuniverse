import { PropsWithChildren } from "react";

// 사용자 정보 수정 / NFT 정보 입력등에 사용되는 Container UI Component
function ContainerForm(props: PropsWithChildren) {
  const children = props.children;

  return (
    <div className="container-form">
      <div>{children}</div>
    </div>
  );
}

export default ContainerForm;
