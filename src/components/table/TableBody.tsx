function TableBody(props: TableBodyProps) {
  const { mode, value } = props;
  return <div className="table-contents">{`${value}`}</div>;
}

export default TableBody;
