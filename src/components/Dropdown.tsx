import { useRef, useEffect, useState } from "react";
import { HiDotsHorizontal } from "react-icons/hi";

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
          className="h-fit"
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
          } absolute top-6 right-0 z-10 items-center justify-center rounded-md bg-[#424245] p-2`}
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
      className="bg- w-full bg-black p-2 text-center hover:bg-blue-900"
      onClick={onClick}
    >
      {children}
    </button>
  );
};

Dropdown.Item = Item;

export default Dropdown;
