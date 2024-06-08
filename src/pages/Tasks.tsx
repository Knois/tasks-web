import API from "api/api";
import ButtonBack from "components/buttons/ButtonBack";
import CardTask from "components/cards/CardTask";
import Loading from "components/shared/Loading";
import { observer } from "mobx-react-lite";
import { useLayoutEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { ITask } from "types/Task";

const ButtonCreateTask = () => (
  <Link to="create-task">
    <button className="form__button form__button-small" type="button">
      Add task
    </button>
  </Link>
);

const Tasks = () => {
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
        toast.error(`Error while getting tasks! ${error}`);
        setTasks([]);
      } finally {
        setIsLoading(false);
      }
    };

    getTasks();
  }, [groupId]);

  if (isLoading) {
    return (
      <div className="board board-loading">
        <Loading />
      </div>
    );
  }

  return (
    <div className="board">
      <ButtonBack title="Back to groups" to={`/${spaceId}`} />

      <div className="board__header">
        <span className="board__title">Tasks</span>

        <ButtonCreateTask />
      </div>

      <div className="board__list">
        {tasks.length > 0 ? (
          tasks.map((task) => <CardTask task={task} key={task.id} />)
        ) : (
          <span className="board__title">No tasks yet</span>
        )}
      </div>
    </div>
  );
};

export default observer(Tasks);
