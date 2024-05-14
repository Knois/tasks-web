import React from "react";

type Props = { isOpen?: boolean };

const IconExpandSidebar: React.FC<Props> = ({ isOpen }) => {
  return (
    <svg width="30px" height="30px" viewBox="0 0 24 24" fill="none">
      <path
        d={isOpen ? "M9 6L15 12L9 18" : "M15 6L9 12L15 18"}
        stroke="#edf5e1"
        strokeWidth="2"
      />
    </svg>
  );
};

export default IconExpandSidebar;
