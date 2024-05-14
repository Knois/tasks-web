import React, { memo } from "react";

type Props = { isOpen?: boolean };

const IconExpandHorizontal: React.FC<Props> = ({ isOpen }) => {
  const pathDirection = isOpen ? "M9 6L15 12L9 18" : "M15 6L9 12L15 18";

  return (
    <svg
      width="30"
      height="30"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#edf5e1"
      strokeWidth="2"
    >
      <path d={pathDirection} />
    </svg>
  );
};

export default memo(IconExpandHorizontal);
