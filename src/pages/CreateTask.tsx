import API from "api/api";
import Select from "components/select/Select";
import Loading from "components/shared/Loading";
import useAutoResizeTextarea from "hooks/useAutoResizeTextarea";
import { memo, useState } from "react";
import { useParams } from "react-router-dom";
import { ITask, Level } from "types/Task";

const CreateTask = () => {
  const { groupId } = useParams();

  const [name, setName] = useState<ITask["name"]>("");
  const [description, setDescription] = useState<ITask["description"]>("");
  const [deadline, setDeadline] = useState<ITask["deadline"]>("");
  const [hardLvl, setHardLvl] = useState<ITask["hardLvl"]>(Level.MEDIUM);
  const [priority, setPriority] = useState<ITask["priority"]>(Level.MEDIUM);
  const [responsibleEmail, setResponsibleEmail] =
    useState<ITask["responsibleEmail"]>("");

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);
  const [isOk, setIsOk] = useState<boolean>(false);

  const textareaRef = useAutoResizeTextarea(description);

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!groupId) {
      return;
    }

    setIsLoading(true);
    setIsError(false);

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
      setIsOk(true);
    } catch (error) {
      console.log(error);
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setName("");
    setDescription("");
    setDeadline("");
    setHardLvl(Level.MEDIUM);
    setPriority(Level.MEDIUM);
    setResponsibleEmail("");
    setIsOk(false);
    setIsError(false);
  };

  if (isLoading) {
    return (
      <div className="screenbox screenbox-headed">
        <Loading />
      </div>
    );
  }

  if (isOk) {
    return (
      <div className="screenbox screenbox-headed">
        <span className="success">Success!</span>

        <button onClick={resetForm} type="button" className="form__button">
          Add another task
        </button>
      </div>
    );
  }

  return (
    <div className="screenbox screenbox-headed">
      <form className="form" onSubmit={onSubmit}>
        {isError && (
          <span className="form__error">Error while creating task</span>
        )}

        <div className="form__box form__box-small">
          <label className="form__label form__label-small">Name</label>

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
            maxLength={255}
            ref={textareaRef}
          />
        </div>

        <div className="form__box form__box-small">
          <label className="form__label form__label-small">Deadline</label>

          <input
            type="text"
            value={deadline}
            onChange={({ target: { value } }) => setDeadline(value)}
            required
            className="form__input form__input-long"
            maxLength={255}
          />
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
            Responsible email
          </label>

          <input
            type="text"
            value={responsibleEmail}
            onChange={({ target: { value } }) => setResponsibleEmail(value)}
            required
            className="form__input form__input-long"
            maxLength={255}
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
