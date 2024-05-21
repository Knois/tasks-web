import React, { memo } from "react";
import { Link } from "react-router-dom";
import { ITask } from "types/Task";

type Props = { task: ITask };

const Task: React.FC<Props> = ({ task }) => {
  return (
    <Link to={`${task.id}`} className="task">
      <div className="task__name">{task.name}</div>
      <div className="task__description">{task.description}</div>
    </Link>
  );
};

export default memo(Task);
