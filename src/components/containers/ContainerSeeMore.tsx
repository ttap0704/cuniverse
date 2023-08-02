"use client";

import { useEffect, useRef, useState } from "react";
import ButtonSeeMore from "../buttons/ButtonSeeMore";

interface ContainerSeeMoreProps {
  children: React.ReactNode;
  defaultMaxHeight: number;
  color?: "black" | "white";
}

function ContainerSeeMore(props: ContainerSeeMoreProps) {
  const children = props.children;
  const defaultMaxHeight = props.defaultMaxHeight;

  const [originHeight, setOriginHeight] = useState(0);
  const [viewButton, setViewButton] = useState(false);
  const containerRef = useRef<null | HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current && containerRef.current.children.length > 0) {
      // 실제 컨텐츠의 높이를 확인하기 위해 height 초기화
      containerRef.current.children[0].setAttribute("style", `height: auto;`);

      // 지정한 height보다 크면 button 생성 / height 설정
      if (containerRef.current.children[0].clientHeight >= defaultMaxHeight) {
        setViewButton(true);
        setOriginHeight(containerRef.current.children[0].clientHeight);

        containerRef.current.children[0].setAttribute(
          "style",
          `height: ${defaultMaxHeight}px`
        );
      }
    }

    return () => setViewButton(false);
  }, [children]);

  const handleContents = (view: boolean) => {
    if (!containerRef.current) return;

    if (view) {
      containerRef.current.children[0].setAttribute(
        "style",
        `height: ${originHeight}px`
      );
    } else {
      containerRef.current.children[0].setAttribute(
        "style",
        `height: ${defaultMaxHeight}px`
      );
    }
  };

  return (
    <div ref={containerRef} className="container-see-more">
      {children}
      {viewButton ? <ButtonSeeMore onClick={handleContents} /> : null}
    </div>
  );
}

export default ContainerSeeMore;
