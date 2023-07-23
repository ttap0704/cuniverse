import { useSetAtom } from "jotai";
import { setDropdownAtom } from "@/store/dropdown";
import DropdownDefault from "./DropdownDefault";
import ButtonDropdownMenuItem from "../buttons/ButtonDropdownMenuItem";

interface DropdownMenuProps {
  items: DropdownMenuItem[];
  onItemClicked: (id: string | number) => void;
}

function DropdownMenu(props: DropdownMenuProps) {
  const setDropdown = useSetAtom(setDropdownAtom);
  const items = props.items;
  const onItemClicked = props.onItemClicked;

  const dropdownClicked = (id: number | string) => {
    onItemClicked(id);

    // Dropdown의 아이템이 클릭되면 닫힘
    setDropdown({ open: false, id: "" });
  };

  return (
    <DropdownDefault>
      {items.map((item) => {
        return (
          <ButtonDropdownMenuItem
            key={`dropdown_item_${item.id}`}
            item={item}
            onClick={dropdownClicked}
          />
        );
      })}
    </DropdownDefault>
  );
}

export default DropdownMenu;
