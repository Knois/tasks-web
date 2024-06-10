import { ReactComponent as Time } from "assets/svg/time.svg";
import IconTaskLevel from "components/shared/icons/IconTaskLevel";
import IconTaskStatus from "components/shared/icons/IconTaskStatus";
import React from "react";
import { Link } from "react-router-dom";
import { ITask, Status } from "types/Task";
import { getFormattedDate } from "utils";

type Props = { task: ITask };

const CardTask: React.FC<Props> = ({ task }) => (
  <Link
    to={`${task.id}`}
    className={`card card-task ${task.status === Status.DONE ? "card-done" : ""}`}
  >
    <div className="card__header">
      <div className="card__row">
        <div className="card__name card__name-nowrap">{task.name}</div>

        <div className="card__icon">
          <IconTaskStatus status={task.status} />
        </div>
      </div>

      <div className="card__row card__row-start">
        <Time />

        <div className="card__description">
          {getFormattedDate(new Date(task.deadline))}
        </div>
      </div>

      <div className="card__row card__row-end card__row-level">
        <div className="card__description card__description-level">
          Priority
        </div>

        <IconTaskLevel level={task.priority} />

        <div className="card__description card__description-level">
          Hard level
        </div>

        <IconTaskLevel level={task.hardLvl} />
      </div>
    </div>

    <div className="card__description">{task.description}</div>
  </Link>
);

export default React.memo(CardTask);
