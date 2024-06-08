import { ReactComponent as Created } from "assets/svg/created.svg";
import { ReactComponent as Done } from "assets/svg/done.svg";
import { ReactComponent as Progress } from "assets/svg/progress.svg";
import { ReactComponent as Rejected } from "assets/svg/rejected.svg";
import React from "react";
import { Link } from "react-router-dom";
import { ITask, Status } from "types/Task";

type IconProps = {
  status: ITask["status"];
};

const Icon: React.FC<IconProps> = ({ status }) => {
  switch (status) {
    case Status.CREATED:
      return <Created />;
    case Status.IN_PROGRESS:
      return <Progress />;
    case Status.DONE:
      return <Done />;
    case Status.REJECTED:
      return <Rejected />;
    default:
      return <></>;
  }
};

type Props = { task: ITask };

const CardTask: React.FC<Props> = ({ task }) => (
  <Link
    to={`${task.id}`}
    className={`card ${task.status === Status.DONE ? "card-done" : ""}`}
  >
    <div className="card__header">
      <div className="card__name card__name-nowrap">{task.name}</div>

      <div className="card__icon">
        <Icon status={task.status} />
      </div>
    </div>
    <div className="card__description">{task.description}</div>
  </Link>
);

export default React.memo(CardTask);
