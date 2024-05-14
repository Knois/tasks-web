import { memo } from "react";

import SelectSpaces from "../select/SelectSpaces";

const Header = () => {
  return (
    <header>
      <SelectSpaces />
    </header>
  );
};

export default memo(Header);
