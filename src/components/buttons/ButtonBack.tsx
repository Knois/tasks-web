import { ReactComponent as Icon } from "assets/svg/arrow_back.svg";
import React from "react";
import { Link } from "react-router-dom";

type Props = { title: string; to: string };

const ButtonBack: React.FC<Props> = ({ title, to }) => (
  <Link to={to} className="button button-back">
    <Icon />

    {title}
  </Link>
);

export default ButtonBack;
