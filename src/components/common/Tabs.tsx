import { usePathname, useRouter } from "next/navigation";

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
          <li key={`tabs_item_${item.id}`}>
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
