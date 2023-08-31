import TableBodyContents from "./TableBodyContents";
import TableHeaderContents from "./TableHeaderContents";
import TableRow from "./TableRow";

function Table(props: TableProps) {
  const { keys, width, titles, items } = props;

  return (
    <div className="table">
      <TableRow>
        {keys.map((key) => {
          return (
            <TableHeaderContents
              title={titles[key]}
              width={width[key]}
              key={`table-header-${key}`}
            />
          );
        })}
      </TableRow>
      <div className="table-body">
        {items.map((item, itemIdx) => {
          return (
            <TableRow key={`table-body-row-${itemIdx}`}>
              {keys.map((key) => {
                return <TableBodyContents {...item[key]} width={width[key]} />;
              })}
            </TableRow>
          );
        })}
      </div>
    </div>
  );
}

export default Table;
