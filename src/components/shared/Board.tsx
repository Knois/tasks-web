import API from "api/api";
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

      <div className="board__list">
        {tasks.map((task) => {
          return (
            <div className="board__item" key={task.id}>
              {task.name}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default memo(Board);
