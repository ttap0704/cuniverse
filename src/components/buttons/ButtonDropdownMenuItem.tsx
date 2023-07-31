import React from "react";

interface DropdownMenuItemProps {
  item: DropdownMenuItem;
  onClick: (id: StringOrNumber) => void;
}

function ButtonDropdownMenuItem(props: DropdownMenuItemProps) {
  const item = props.item;
  const onClick = props.onClick;

  const handleDropdownItemClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    // 아이템 클릭하면 Dropdownd이 닫히는 현상이 있어 이벤트 전파 방지
    e.stopPropagation();
    onClick(item.id);
  };

  return (
    <button
      className="button-dropdown-menu"
      onClick={handleDropdownItemClick}
      data-testid={`button-dropdown-menu-${item.id}`}
    >
      {item.label}
    </button>
  );
}

export default ButtonDropdownMenuItem;
