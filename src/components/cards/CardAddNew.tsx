import { ReactComponent as Icon } from "assets/svg/add_new.svg";
import React from "react";
import { Link } from "react-router-dom";

type Props = { to: string };

const CardAddNew: React.FC<Props> = ({ to }) => (
  <Link className="card card-add" to={to}>
    <Icon />
  </Link>
);

export default React.memo(CardAddNew);
