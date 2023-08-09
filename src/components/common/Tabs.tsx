"use client";

import { usePathname, useRouter } from "next/navigation";

// 페이지에 사용되는 Tabs
// Menu 클릭 시, 해당하는 페이지로 이동

interface TabsProps {
  items: TabsMenuItem[];
}

function Tabs(props: TabsProps) {
  const pathname = usePathname();
  const router = useRouter();
  const items = props.items;

  return (
    <ul className="tabs-wrapper">
      {items.map((item) => {
        return (
          <li key={`tabs-item-${item.id}`}>
            <button
              onClick={() => router.push(item.path)}
              className={
                item.includePath == pathname || item.path == pathname
                  ? "selected"
                  : ""
              }
            >
              {item.label}
            </button>
          </li>
        );
      })}
    </ul>
  );
}

export default Tabs;
