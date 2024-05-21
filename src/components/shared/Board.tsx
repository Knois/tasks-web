import API from "api/api";
import TasksList from "components/shared/TasksList";
import { memo, useLayoutEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ITask } from "types/Task";

const Board = () => {
  const { spaceId, groupId } = useParams();

  const [tasks, setTasks] = useState<ITask[]>([]);

  useLayoutEffect(() => {
    const getTasks = async () => {
      if (!groupId) {
        return;
      }

      try {
        const { data } = await API.getTasksByGroupId(groupId);
        setTasks(data);
      } catch (error) {
        console.log(error);
      }
    };

    getTasks();
  }, [groupId]);

  return (
    <div className="board">
      <Link to={`/${spaceId}/${groupId}/create-task`}>
        <button className="form__button form__button-small" type="button">
          Add task
        </button>
      </Link>

      <TasksList tasks={tasks} />
    </div>
  );
};

export default memo(Board);
