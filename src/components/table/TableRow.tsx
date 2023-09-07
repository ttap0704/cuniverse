import { HTMLAttributes, PropsWithChildren } from "react";
import tableStyles from "@/css/components/table.module.scss";

interface TableRowProps extends PropsWithChildren {
  style?: HTMLAttributes<HTMLDivElement>["style"];
}

function TableRow({ children, style }: TableRowProps) {
  return (
    <div style={style} className={tableStyles["table-row"]}>
      {children}
    </div>
  );
}

export default TableRow;
