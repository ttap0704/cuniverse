import { useEffect, useRef, useState } from "react";
import ButtonSeeMore from "../buttons/ButtonSeeMore";

interface ContainerSeeMoreProps {
  children: React.ReactNode;
}

function ContainerSeeMore(props: ContainerSeeMoreProps) {
  const children = props.children;

  const [viewButton, setViewButton] = useState(false);
  const containerRef = useRef<null | HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current && containerRef.current.children.length > 0) {
      if (containerRef.current.children[0].clientHeight >= 50)
        setViewButton(true);
    }

    return () => setViewButton(false);
  }, []);

  const handleContents = (view: boolean) => {
    if (!containerRef.current) return;

    if (view) {
      containerRef.current.children[0].setAttribute(
        "style",
        "max-height: 1000px"
      );
    } else {
      containerRef.current.children[0].setAttribute(
        "style",
        "max-height: 50px"
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
