import containerStyles from "@/css/components/containers.module.scss";

interface ContainerNFTContentsProps {
  children: React.ReactNode;
}

function ContainerNFTContents(props: ContainerNFTContentsProps) {
  const children = props.children;

  return (
    <div className={containerStyles["container-nft-contents"]}>{children}</div>
  );
}

export default ContainerNFTContents;
