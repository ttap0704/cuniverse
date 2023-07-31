import React from "react";

interface DropdownMenuItemProps {
  item: DropdownMenuItem;
  onClick: (id: StringOrNumber) => void;
}

function DropdownMenuItem(props: DropdownMenuItemProps) {
  const item = props.item;
  const onClick = props.onClick;

  const handleDropdownItemClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    // 아이템 클릭하면 Dropdownd이 닫히는 현상이 있어 이벤트 전파 방지
    e.stopPropagation();
    onClick(item.id);
  };

  return <button onClick={handleDropdownItemClick}>{item.label}</button>;
}

export default DropdownMenuItem;
