import IconExpandVertical from "components/shared/icons/IconExpandVertical";
import { useClickOutside } from "hooks/useClickOutside";
import React, { memo, useRef, useState } from "react";

type Props = {
  value: string;
  options: string[];
  setValue: React.Dispatch<React.SetStateAction<string>>;
};

const Select: React.FC<Props> = ({ value, options, setValue }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const handleClick = () => setIsOpen((s) => !s);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);

  useClickOutside(dropdownRef, rootRef, () => {
    setIsOpen(false);
  });

  return (
    <div className="select">
      <div
        className={`select__root select__root-long ${isOpen ? "select__root-open" : ""}`}
        onClick={handleClick}
        ref={rootRef}
      >
        <span className="select__label">{value}</span>

        <IconExpandVertical isOpen={isOpen} />
      </div>

      {isOpen && (
        <div className="select__dropdown" ref={dropdownRef}>
          <div className="select__dropdown__list">
            {options.map((option, index) => {
              const handleClick = () => {
                setValue(option);
                setIsOpen(false);
              };

              return (
                <div
                  className="select__dropdown__item"
                  key={index}
                  onClick={handleClick}
                >
                  {option}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default memo(Select);
