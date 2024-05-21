import Task from "components/shared/Task";
import React, { memo } from "react";
import { ITask } from "types/Task";

type Props = { tasks: ITask[] };

const TasksList: React.FC<Props> = ({ tasks }) => {
  return (
    <div className="board__list">
      {tasks.map((task) => {
        return <Task task={task} key={task.id} />;
      })}

      {tasks.length === 0 && <span>No tasks yet</span>}
    </div>
  );
};

export default memo(TasksList);
