import { ReactComponent as IconHome } from "assets/svg/home.svg";
import { ReactComponent as IconProfile } from "assets/svg/profile.svg";
import SelectSpaces from "components/select/SelectSpaces";
import { memo } from "react";
import { Link } from "react-router-dom";

const Header = () => (
  <header className="header">
    <div className="header__left">
      <Link to="/" className="header__button">
        <IconHome />
      </Link>

      <SelectSpaces />
    </div>

    <Link to="/profile" className="header__button">
      <IconProfile />
    </Link>
  </header>
);

export default memo(Header);
