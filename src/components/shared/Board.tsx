import API from "api/api";
import Loading from "components/shared/Loading";
import TasksList from "components/shared/TasksList";
import { memo, useLayoutEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ITask } from "types/Task";

const Board = () => {
  const { spaceId, groupId } = useParams();

  const [tasks, setTasks] = useState<ITask[]>([]);

  const [isLoading, setIsLoading] = useState(false);

  useLayoutEffect(() => {
    const getTasks = async () => {
      if (!groupId) {
        setTasks([]);
        return;
      }

      setIsLoading(true);

      try {
        const { data } = await API.getTasksByGroupId(groupId);
        setTasks(data);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };

    getTasks();
  }, [groupId]);

  if (!spaceId || !groupId) {
    return <div className="board" />;
  }

  if (isLoading) {
    return (
      <div className="board screenbox screenbox-headed">
        <Loading />
      </div>
    );
  }

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
