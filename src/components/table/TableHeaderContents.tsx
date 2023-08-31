function TableHeaderContents({
  title,
  width,
}: {
  title: string;
  width: number;
}) {
  return (
    <div className="table-contents" style={{ flex: width }}>
      {title}
    </div>
  );
}

export default TableHeaderContents;
