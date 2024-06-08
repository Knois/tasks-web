import IconExpandVertical from "components/shared/icons/IconExpandVertical";
import { useClickOutside } from "hooks/useClickOutside";
import React, { memo, useRef, useState } from "react";

type Props = {
  value: string;
  options: string[];
  setValue: React.Dispatch<React.SetStateAction<string>>;
  disabled?: boolean;
};

const Select: React.FC<Props> = ({ value, options, setValue, disabled }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const handleClick = () => {
    !disabled && setIsOpen((s) => !s);
  };

  const dropdownRef = useRef<HTMLDivElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);

  useClickOutside(dropdownRef, rootRef, () => {
    setIsOpen(false);
  });

  return (
    <div className="select select-long">
      <div
        className={`select__root ${isOpen ? "select__root-open" : ""} ${disabled ? "select__root-disabled" : ""}`}
        onClick={handleClick}
        ref={rootRef}
      >
        <span className="select__label">{value}</span>

        {!disabled && <IconExpandVertical isOpen={isOpen} />}
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
                  <span className="select__dropdown__item__label">
                    {option}
                  </span>
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
