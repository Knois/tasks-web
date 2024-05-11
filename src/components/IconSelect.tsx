import React from "react";

type Props = { isOpen: boolean };

const IconSelect = ({ isOpen }: Props) => {
  return (
    <svg width="24px" height="24px" viewBox="0 0 24 24" fill="none">
      <path
        d={isOpen ? "M18 15L12 9L6 15" : "M18 9L12 15L6 9"}
        stroke="#edf5e1"
        strokeWidth="2"
      />
    </svg>
  );
};

export default IconSelect;
