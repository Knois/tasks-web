import API from "api/api";
import Select from "components/select/Select";
import DateTimePicker from "components/shared/DateTimePicker";
import Loading from "components/shared/Loading";
import Modal from "components/shared/Modal";
import useAutoResizeTextarea from "hooks/useAutoResizeTextarea";
import { useModal } from "hooks/useModal";
import { memo, useLayoutEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { IGroup } from "types/Group";
import { ITask, Level, Status } from "types/Task";

const EditTask = () => {
  const { taskId } = useParams();

  const navigate = useNavigate();

  const [name, setName] = useState<ITask["name"]>("");
  const [description, setDescription] = useState<ITask["description"]>("");
  const [deadline, setDeadline] = useState<ITask["deadline"]>("");
  const [hardLvl, setHardLvl] = useState<ITask["hardLvl"]>(Level.MEDIUM);
  const [priority, setPriority] = useState<ITask["priority"]>(Level.MEDIUM);
  const [status, setStatus] = useState<ITask["status"]>(Status.CREATED);
  const [failureReason, setFailureReason] =
    useState<ITask["failureReason"]>("");
  const [responsibleEmail, setResponsibleEmail] =
    useState<ITask["responsibleEmail"]>("");
  const [groupId, setGroupId] = useState<ITask["groupId"]>("");
  const [availableMemberEmails, setAvailableMemberEmails] = useState<
    IGroup["memberEmails"]
  >([]);

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [isEditing, setIsEditing] = useState<boolean>(false);

  const textareaRef = useAutoResizeTextarea(description);

  const { isVisible, modalOptions, openModal, closeModal } = useModal();

  const setDataToState = (data: ITask) => {
    setName(data.name);
    setDescription(data.description);
    setDeadline(data.deadline);
    setHardLvl(data.hardLvl);
    setPriority(data.priority);
    setStatus(data.status);
    setFailureReason(data.failureReason);
    setResponsibleEmail(data.responsibleEmail);
    setGroupId(data.groupId);
  };

  const deleteTask = async () => {
    setIsLoading(true);

    if (!taskId) {
      return;
    }

    try {
      await API.deleteTask(taskId);
      toast.success("Task deleted");
      navigate(-1);
    } catch (error) {
      toast.error(`Error deleting task! ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!isEditing) {
      setIsEditing(true);
      return;
    }

    setIsLoading(true);

    if (!taskId) {
      return;
    }

    const task = {
      name,
      description,
      deadline,
      status,
      hardLvl,
      priority,
      failureReason,
      responsibleEmail,
      groupId,
    };

    try {
      await API.updateTask(task, taskId);
      toast.success(`The task was successfully updated!`);
      navigate(-1);
    } catch (error) {
      toast.error(`Error updating task! ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  const onDelete = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event.preventDefault();

    openModal(`Are you sure you want to delete the task "${name}"?`, () => {
      deleteTask();
      closeModal();
    });
  };

  useLayoutEffect(() => {
    const getTask = async () => {
      if (!taskId) {
        return;
      }

      setIsLoading(true);

      try {
        const { data } = await API.getTaskById(taskId);
        setDataToState(data);
      } catch (error) {
        toast.error(`Error getting task info! ${error}`);
      } finally {
        setIsLoading(false);
      }
    };

    getTask();
  }, [taskId]);

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
        toast.error(`Error getting group members! ${error}`);
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
    <>
      <form className="form" onSubmit={onSubmit}>
        <div className="form__box form__box-small">
          <label className="form__label form__label-small">Name</label>

          <input
            type="text"
            value={name}
            onChange={({ target: { value } }) => setName(value)}
            required
            className="form__input form__input-long"
            maxLength={255}
            disabled={!isEditing}
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
            disabled={!isEditing}
          />
        </div>

        <div className="form__box form__box-small">
          <label className="form__label form__label-small">Deadline</label>

          <DateTimePicker
            value={deadline}
            setValue={setDeadline}
            disabled={!isEditing}
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
            disabled={!isEditing}
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
            disabled={!isEditing}
          />
        </div>

        <div className="form__box form__box-small">
          <label className="form__label form__label-small">Status</label>

          <Select
            value={status}
            options={Object.values(Status)}
            setValue={setStatus as React.Dispatch<React.SetStateAction<string>>}
            disabled={!isEditing}
          />
        </div>

        {status === Status.REJECTED && (
          <div className="form__box form__box-small">
            <label className="form__label form__label-small">
              Failure reason
            </label>

            <input
              type="text"
              value={failureReason}
              onChange={({ target: { value } }) => setFailureReason(value)}
              required
              className="form__input form__input-long"
              maxLength={255}
              disabled={!isEditing}
            />
          </div>
        )}

        <div className="form__box form__box-small">
          <label className="form__label form__label-small">
            Responsible email
          </label>

          <Select
            value={responsibleEmail}
            options={availableMemberEmails}
            setValue={setResponsibleEmail}
            disabled={!isEditing}
          />
        </div>

        <button type="submit" className="form__button">
          {isEditing ? "Update task" : "Edit task"}
        </button>

        <button type="button" className="form__button" onClick={onDelete}>
          Delete task
        </button>
      </form>

      {isVisible && modalOptions && (
        <Modal
          text={modalOptions.text}
          onOk={modalOptions.onOk}
          onCancel={closeModal}
        />
      )}
    </>
  );
};

export default memo(EditTask);
