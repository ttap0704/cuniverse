import { useSetAtom } from "jotai";
import { setDropdownAtom } from "@/store/dropdown";
import DropdownDefault from "./DropdownDefault";
import ButtonDropdownMenuItem from "../buttons/ButtonDropdownMenuItem";

interface DropdownMenuProps {
  items: DropdownMenuItem[];
  onItemClicked: (id: StringOrNumber) => void;
  targetId: string;
}

function DropdownMenu(props: DropdownMenuProps) {
  const setDropdown = useSetAtom(setDropdownAtom);
  const items = props.items;
  const onItemClicked = props.onItemClicked;
  const targetId = props.targetId;

  const dropdownClicked = (id: StringOrNumber) => {
    onItemClicked(id);

    // Dropdown의 아이템이 클릭되면 닫힘
    setDropdown({ open: false, id: "" });
  };

  return (
    <DropdownDefault targetId={targetId}>
      <ul data-testid="dropdown-menu-wrapper">
        {items.map((item) => {
          return (
            <li key={`dropdown_item_${item.id}`}>
              <ButtonDropdownMenuItem
                data-testid={`dropdown_item_${item.id}`}
                item={item}
                onClick={dropdownClicked}
              />
            </li>
          );
        })}
      </ul>
    </DropdownDefault>
  );
}

export default DropdownMenu;
