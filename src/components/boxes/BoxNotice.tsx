import boxStyles from "@/css/components/boxes.module.scss";

interface BoxNoticeProps {
  text: string;
}

function BoxNotice(props: BoxNoticeProps) {
  const text = props.text;
  return <div className={boxStyles["box-notice"]}>{text}</div>;
}

export default BoxNotice;
