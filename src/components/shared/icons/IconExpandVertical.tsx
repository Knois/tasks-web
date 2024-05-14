import React, { memo } from "react";

type Props = { isOpen?: boolean };

const IconExpandVertical: React.FC<Props> = ({ isOpen }) => {
  const pathDirection = isOpen ? "M18 15L12 9L6 15" : "M18 9L12 15L6 9";

  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#edf5e1"
      strokeWidth="2"
    >
      <path d={pathDirection} />
    </svg>
  );
};

export default memo(IconExpandVertical);
