import { HTMLAttributes, PropsWithChildren } from "react";

interface TableRowProps extends PropsWithChildren {
  style?: HTMLAttributes<HTMLDivElement>["style"];
}

function TableRow({ children, style }: TableRowProps) {
  return (
    <div style={style} className="table-row">
      {children}
    </div>
  );
}

export default TableRow;
