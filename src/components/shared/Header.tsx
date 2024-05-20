import SelectSpaces from "components/select/SelectSpaces";
import { memo } from "react";

const Header = () => {
  return (
    <header>
      <SelectSpaces />
    </header>
  );
};

export default memo(Header);
