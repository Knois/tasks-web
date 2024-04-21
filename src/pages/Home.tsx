import API from "api/api";
import { useLayoutEffect, useState } from "react";
import { IGroup } from "types/Group";
import { ISpace } from "types/Space";
import { ITask } from "types/Task";

const Task = ({ task }: { task: ITask }) => {
  const [isShow, setIsShow] = useState(false);

  const handleClick = () => setIsShow((s) => !s);

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <div onClick={handleClick}>{task.name}</div>
      {isShow && (
        <>
          <div>{task.description}</div>
          <div>{task.creationTime}</div>
          <div>{task.deadline}</div>
          <div>{task.status}</div>
        </>
      )}
    </div>
  );
};

const Space = ({
  space,
  setGroups,
}: {
  space: ISpace;
  setGroups: React.Dispatch<React.SetStateAction<IGroup[]>>;
}) => {
  const handleClick = async () => {
    const array = [] as IGroup[];

    for (const el of space.groupIds) {
      const { data } = await API.getGroupsById(el);
      array.push(data);
    }

    setGroups(array);
  };

  return <div onClick={handleClick}>{space.name}</div>;
};

const Group = ({
  group,
  setTasks,
}: {
  group: IGroup;
  setTasks: React.Dispatch<React.SetStateAction<ITask[]>>;
}) => {
  const handleClick = async () => {
    const { data } = await API.getTasksByGroupId(group.id);
    setTasks(data);
  };

  return <div onClick={handleClick}>{group.name}</div>;
};

const Home = () => {
  const [spaces, setSpaces] = useState<ISpace[]>([]);

  const [groups, setGroups] = useState<IGroup[]>([]);

  const [tasks, setTasks] = useState<ITask[]>([]);

  useLayoutEffect(() => {
    const getSpaces = async () => {
      try {
        const { data } = await API.getSpaces();
        setSpaces(data);
      } catch (error) {
        console.log(error);
      }
    };

    getSpaces();
  }, []);

  return (
    <header>
      <span>Home</span>
      <div className="spaces">
        {spaces.map((space) => (
          <Space space={space} key={space.id} setGroups={setGroups} />
        ))}
      </div>

      <section>
        {groups.map((group) => (
          <Group key={group.id} group={group} setTasks={setTasks} />
        ))}
      </section>

      <section>
        {tasks.map((task) => (
          <Task key={task.id} task={task} />
        ))}
      </section>
    </header>
  );
};

export default Home;
