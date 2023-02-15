import { useState } from "react";

// for logged in user only
export const useHamburgerDropDown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleClick = () => {
    setIsAnimating(true);
    setIsOpen(!isOpen);
    setTimeout(() => {
      setIsAnimating(false);
    }, 700 /* delay waits for animation to finish */);
  };

  return { isOpen, isAnimating, handleClick };
};

export default useHamburgerDropDown;
