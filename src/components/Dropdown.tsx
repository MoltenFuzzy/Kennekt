import { useRef, useEffect, useState } from "react";
import { HiDotsHorizontal } from "react-icons/hi";
import "animate.css";

interface DropdownProps {
  children: React.ReactNode;
}

const Dropdown = ({ children }: DropdownProps) => {
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        // Close the dropdown
        setIsOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [dropdownRef]);

  return (
    <div ref={dropdownRef} className="h-0">
      <div className="relative inline-flex w-full align-middle">
        <button
          type="button"
          className="h-fit rounded-md p-2 hover:bg-[#343436]"
          onClick={(e) => {
            e.stopPropagation();
            setIsOpen(!isOpen);
          }}
        >
          <HiDotsHorizontal size={20} color="white" />
        </button>
        <div
          className={`${
            isOpen ? "flex flex-col" : "hidden"
          } animate__animated animate__fadeIn animate__faster absolute top-9 z-10 items-center justify-center rounded-md bg-[#424245] `}
        >
          {children}
        </div>
      </div>
    </div>
  );
};

interface ItemProps {
  children: React.ReactNode;
  onClick?: () => void;
}

const Item = ({ children, onClick }: ItemProps) => {
  return (
    <button
      type="button"
      className=" w-full rounded p-2 text-center text-sm hover:border hover:border-zinc-600 hover:bg-[#343436] hover:shadow-md"
      onClick={onClick}
    >
      {children}
    </button>
  );
};

Dropdown.Item = Item;

export default Dropdown;
