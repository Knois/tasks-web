import { useEffect } from "react";

export const useClickOutside = (
  dropdownRef: React.RefObject<HTMLElement>,
  rootRef: React.RefObject<HTMLElement>,
  callback: () => void,
) => {
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      const isOutside =
        !dropdownRef.current?.contains(target) &&
        !rootRef.current?.contains(target);

      if (isOutside) {
        callback();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [callback, dropdownRef, rootRef]);
};
