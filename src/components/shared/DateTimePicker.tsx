import IconExpandVertical from "components/shared/icons/IconExpandVertical";
import { useClickOutside } from "hooks/useClickOutside";
import React, { memo, useRef, useState } from "react";
import { getFormattedDate } from "utils";

import Calendar from "./Calendar";

type Props = {
  value: string;
  setValue: React.Dispatch<React.SetStateAction<string>>;
  disabled?: boolean;
};

const DateTimePicker: React.FC<Props> = ({ value, setValue, disabled }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const handleClick = () => {
    !disabled && setIsOpen((s) => !s);
  };

  const dropdownRef = useRef<HTMLDivElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);

  useClickOutside(dropdownRef, rootRef, () => {
    setIsOpen(false);
  });

  const date = new Date(value);
  const label = getFormattedDate(date);

  return (
    <div className="select select-long">
      <div
        className={`select__root ${isOpen ? "select__root-open" : ""} ${disabled ? "select__root-disabled" : ""}`}
        onClick={handleClick}
        ref={rootRef}
      >
        <span className="select__label">{label}</span>

        {!disabled && <IconExpandVertical isOpen={isOpen} />}
      </div>

      {isOpen && (
        <div
          className="select__dropdown select__dropdown-calendar"
          ref={dropdownRef}
        >
          <Calendar
            selectedDate={date}
            setSelectedDate={(date: Date) => setValue(date.toISOString())}
          />
        </div>
      )}
    </div>
  );
};

export default memo(DateTimePicker);
