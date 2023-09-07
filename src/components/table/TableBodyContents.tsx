import TypographyCopy from "../typography/TypographyCopy";
import tableStyles from "@/css/components/table.module.scss";

function TableBodyContents(props: {
  mode: TableItemMode;
  value: StringOrNumber;
  width: number;
  copyText?: string;
}) {
  const { mode, value, width, copyText } = props;

  let contents: null | React.ReactNode = null;

  if (mode == "text") contents = value;
  else if (mode == "copy" && copyText)
    contents = <TypographyCopy text={`${value}`} copyText={copyText} />;
  else contents = value;

  return (
    <div className={tableStyles["table-contents"]} style={{ flex: width }}>
      {contents}
    </div>
  );
}

export default TableBodyContents;
