import React from "react";
import { Link } from "react-router-dom";
import { IGroup } from "types/Group";

type Props = { group: IGroup };

const CardGroup: React.FC<Props> = ({ group }) => {
  return (
    <Link to={group.id} className="card">
      <div className="card__name">{group.name}</div>
    </Link>
  );
};

export default React.memo(CardGroup);
