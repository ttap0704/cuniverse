"use client";

import { useRouter } from "next/navigation";

interface TabsProps {
  items: TabsMenuItem[];
}

function Tabs(props: TabsProps) {
  const router = useRouter();
  const items = props.items;

  return (
    <ul className="tabs-wrapper">
      {items.map((item) => {
        return (
          <li key={`tabs_item_${item.id}`}>
            <button
              onClick={() => router.push(item.path)}
              className={
                item.includePath == location.pathname ||
                item.path == location.pathname
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
