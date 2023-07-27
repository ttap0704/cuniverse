interface ContainerNFTContentsProps {
  children: React.ReactNode;
}

function ContainerNFTContents(props: ContainerNFTContentsProps) {
  const children = props.children;

  return <div className="container-nft-contents">{children}</div>;
}

export default ContainerNFTContents;
