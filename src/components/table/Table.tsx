import TableBodyContents from "./TableBodyContents";
import TableHeaderContents from "./TableHeaderContents";
import TableRow from "./TableRow";
import tableStyles from "@/css/components/table.module.scss";

function Table(props: TableProps) {
  const { keys, width, titles, items } = props;

  return (
    <div className={tableStyles["table"]}>
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
      <div className={tableStyles["table-body"]}>
        {items.map((item, itemIdx) => {
          return (
            <TableRow key={`table-body-row-${itemIdx}`}>
              {keys.map((key) => {
                return (
                  <TableBodyContents
                    key={`table-body-row-${itemIdx}-${key}`}
                    {...item[key]}
                    width={width[key]}
                  />
                );
              })}
            </TableRow>
          );
        })}
      </div>
    </div>
  );
}

export default Table;
