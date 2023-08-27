import { PropsWithChildren } from "react";

function TableRow({ children }: PropsWithChildren) {
  return <div className="table-row">{children}</div>;
}

export default TableRow;
