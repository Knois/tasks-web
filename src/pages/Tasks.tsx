import API from "api/api";
import ButtonBack from "components/buttons/ButtonBack";
import CardTask from "components/cards/CardTask";
import Loading from "components/shared/Loading";
import { observer } from "mobx-react-lite";
import { useLayoutEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { IGroup } from "types/Group";
import { ITask } from "types/Task";

const ButtonCreateTask = () => (
  <Link to="create-task">
    <button className="form__button form__button-small" type="button">
      Add task
    </button>
  </Link>
);

const ButtonEditGroup = () => (
  <Link to="edit-group">
    <button type="button" className="form__button form__button-small">
      Edit group
    </button>
  </Link>
);

const Tasks = () => {
  const { spaceId, groupId } = useParams();

  const [tasks, setTasks] = useState<ITask[]>([]);
  const [group, setGroup] = useState<IGroup | null>(null);

  const [isLoading, setIsLoading] = useState(false);

  useLayoutEffect(() => {
    const getTasks = async () => {
      if (!groupId) {
        setTasks([]);
        return;
      }

      setIsLoading(true);

      try {
        const { data } = await API.getGroupById(groupId);
        setGroup(data);
      } catch (error) {
        toast.error(`Error while getting group info! ${error}`);
        setGroup(null);
      }

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
      <ButtonBack title="Back to groups list" to={`/${spaceId}`} />

      <span className="board__title">{group?.name}</span>

      <div className="board__row">
        <span className="board__title">Tasks</span>

        <ButtonEditGroup />

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
