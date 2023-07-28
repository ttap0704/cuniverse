interface BoxNoticeProps {
  text: string;
}

function BoxNotice(props: BoxNoticeProps) {
  const text = props.text;
  return <div className="box-notice">{text}</div>;
}

export default BoxNotice;
