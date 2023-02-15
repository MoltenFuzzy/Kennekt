import React from "react";
import { HiDotsHorizontal } from "react-icons/hi";

interface DropdownProps {
  children: React.ReactNode;
}

const Dropdown = ({ children }: DropdownProps) => {
  const [isPressed, setIsPressed] = React.useState(false);

  return (
    <>
      <button
        title="dropdown"
        type="button"
        className="h-fit"
        onClick={() => setIsPressed(!isPressed)}
      >
        <HiDotsHorizontal size={20} color="white" />
      </button>
      <div className={`${isPressed ? "block" : "hidden"} absolute`}>
        <div className="relative  h-10 w-32 rounded-lg bg-[#424245]">
          {children}
        </div>
      </div>
    </>
  );
};

interface ItemProps {
  children: React.ReactNode;
  onClick?: () => void;
}

const Item = ({ children, onClick }: ItemProps) => {
  return (
    <button type="button" className="" onClick={onClick}>
      {children}
    </button>
  );
};

Dropdown.Item = Item;

export default Dropdown;
