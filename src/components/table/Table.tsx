import TableHeader from "./TableHeader";
import TableRow from "./TableRow";

function Table(props: TableProps) {
  const { keys, width, titles, items } = props;

  return (
    <div className="table">
      <TableRow>
        {keys.map((key) => {
          return (
            <TableHeader title={titles[key]} key={`table-header-${key}`} />
          );
        })}
      </TableRow>
      <TableRow>2</TableRow>
    </div>
  );
}

export default Table;
