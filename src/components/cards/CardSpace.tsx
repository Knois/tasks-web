import React from "react";
import { Link } from "react-router-dom";
import { ISpace } from "types/Space";

type Props = { space: ISpace };

const CardSpace: React.FC<Props> = ({ space }) => {
  return (
    <Link to={space.id} className="card">
      <div className="card__name">{space.name}</div>
      <div className="card__description">{space.description}</div>
    </Link>
  );
};

export default React.memo(CardSpace);
