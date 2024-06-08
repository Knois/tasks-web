import API from "api/api";
import Select from "components/select/Select";
import DateTimePicker from "components/shared/DateTimePicker";
import Loading from "components/shared/Loading";
import useAutoResizeTextarea from "hooks/useAutoResizeTextarea";
import { memo, useLayoutEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { IGroup } from "types/Group";
import { ITask, Level } from "types/Task";

const CreateTask = () => {
  const { groupId } = useParams();

  const navigate = useNavigate();

  const [name, setName] = useState<ITask["name"]>("");
  const [description, setDescription] = useState<ITask["description"]>("");
  const [deadline, setDeadline] = useState<ITask["deadline"]>(
    new Date().toISOString(),
  );
  const [hardLvl, setHardLvl] = useState<ITask["hardLvl"]>(Level.MEDIUM);
  const [priority, setPriority] = useState<ITask["priority"]>(Level.MEDIUM);
  const [responsibleEmail, setResponsibleEmail] =
    useState<ITask["responsibleEmail"]>("");

  const [availableMemberEmails, setAvailableMemberEmails] = useState<
    IGroup["memberEmails"]
  >([]);

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const textareaRef = useAutoResizeTextarea(description);

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!groupId) {
      return;
    }

    setIsLoading(true);

    const task = {
      name,
      description,
      deadline,
      hardLvl,
      priority,
      responsibleEmail,
      groupId,
    };

    try {
      await API.createTask(task);
      toast.success("Task created");
      navigate(-1);
    } catch (error) {
      toast.error(`Error while creating task! ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  useLayoutEffect(() => {
    //get group info and set available member emails
    const getGroup = async () => {
      if (!groupId) {
        return;
      }

      setIsLoading(true);

      try {
        const { data } = await API.getGroupById(groupId);
        setAvailableMemberEmails(data.memberEmails);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };

    getGroup();
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
      <form className="form" onSubmit={onSubmit}>
        <div className="form__box form__box-small">
          <label className="form__label form__label-small">Name *</label>

          <input
            type="text"
            value={name}
            onChange={({ target: { value } }) => setName(value)}
            required
            className="form__input form__input-long"
            maxLength={255}
          />
        </div>

        <div className="form__box form__box-small">
          <label className="form__label form__label-small">Description</label>

          <textarea
            value={description}
            onChange={({ target: { value } }) => setDescription(value)}
            className="form__input form__input-long form__input-textarea"
            maxLength={9999999}
            ref={textareaRef}
          />
        </div>

        <div className="form__box form__box-small">
          <label className="form__label form__label-small">Deadline</label>

          <DateTimePicker value={deadline} setValue={setDeadline} />
        </div>

        <div className="form__box form__box-small">
          <label className="form__label form__label-small">Hard level</label>

          <Select
            value={hardLvl}
            options={Object.values(Level)}
            setValue={
              setHardLvl as React.Dispatch<React.SetStateAction<string>>
            }
          />
        </div>

        <div className="form__box form__box-small">
          <label className="form__label form__label-small">Priority</label>

          <Select
            value={priority}
            options={Object.values(Level)}
            setValue={
              setPriority as React.Dispatch<React.SetStateAction<string>>
            }
          />
        </div>

        <div className="form__box form__box-small">
          <label className="form__label form__label-small">
            Responsible email *
          </label>

          <Select
            value={responsibleEmail}
            options={availableMemberEmails}
            setValue={setResponsibleEmail}
          />
        </div>

        <button type="submit" className="form__button">
          Create task
        </button>
      </form>
    </div>
  );
};

export default memo(CreateTask);
