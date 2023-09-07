import tableStyles from "@/css/components/table.module.scss";

function TableHeaderContents({
  title,
  width,
}: {
  title: string;
  width: number;
}) {
  return (
    <div className={tableStyles["table-contents"]} style={{ flex: width }}>
      {title}
    </div>
  );
}

export default TableHeaderContents;
