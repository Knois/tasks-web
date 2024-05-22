import { ReactComponent as Radio } from "assets/svg/radio.svg";
import { ReactComponent as RadioFilled } from "assets/svg/radio_filled.svg";
import IconExpandVertical from "components/shared/icons/IconExpandVertical";
import { useClickOutside } from "hooks/useClickOutside";
import React, { memo, useRef, useState } from "react";
type Props = {
  values: string[];
  options: string[];
  setValues: React.Dispatch<React.SetStateAction<string[]>>;
  disabled?: boolean;
};

const SelectMulti: React.FC<Props> = ({
  values,
  options,
  setValues,
  disabled,
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const handleClick = () => {
    !disabled && setIsOpen((s) => !s);
  };

  const dropdownRef = useRef<HTMLDivElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);

  useClickOutside(dropdownRef, rootRef, () => {
    setIsOpen(false);
  });

  const label = values.length
    ? `${values.length} ${values.length === 1 ? "member" : "members"}`
    : "Select members";

  const rootClassName = `select__root select__root-long ${isOpen ? "select__root-open" : ""} ${disabled ? "select__root-disabled" : ""}`;

  return (
    <div className="select">
      <div className={rootClassName} onClick={handleClick} ref={rootRef}>
        <span className="select__label">{label}</span>

        {!disabled && <IconExpandVertical isOpen={isOpen} />}
      </div>

      {isOpen && (
        <div className="select__dropdown" ref={dropdownRef}>
          <div className="select__dropdown__list">
            {options.map((option, index) => {
              const isSelected = values.includes(option);

              const icon = isSelected ? <RadioFilled /> : <Radio />;

              const handleClick = () => {
                isSelected
                  ? setValues((s) => s.filter((v) => v !== option))
                  : setValues((s) => [...s, option]);
              };

              return (
                <div
                  className="select__dropdown__item"
                  key={index}
                  onClick={handleClick}
                >
                  {icon}

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

export default memo(SelectMulti);
