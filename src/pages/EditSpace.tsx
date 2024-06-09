import API from "api/api";
import ButtonBack from "components/buttons/ButtonBack";
import StringArrayInput from "components/input/StringArrayInput";
import Loading from "components/shared/Loading";
import Modal from "components/shared/Modal";
import useAutoResizeTextarea from "hooks/useAutoResizeTextarea";
import { useModal } from "hooks/useModal";
import { useStore } from "hooks/useStore";
import { observer } from "mobx-react-lite";
import { useLayoutEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { ISpace } from "types/Space";

const EditSpace = () => {
  const { spaceId } = useParams();

  const navigate = useNavigate();

  const { userStore } = useStore();

  const [name, setName] = useState<ISpace["name"]>("");
  const [description, setDescription] = useState<ISpace["description"]>("");
  const [memberEmails, setMemberEmails] = useState<ISpace["memberEmails"]>([]);
  const [groups, setGroups] = useState<ISpace["groups"]>([]);

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const textareaRef = useAutoResizeTextarea(description);

  const { isVisible, modalOptions, openModal, closeModal } = useModal();

  const setDataToState = (data: ISpace) => {
    setName(data.name);
    setDescription(data.description);
    setMemberEmails(data.memberEmails);
    setGroups(data.groups);
  };

  const deleteSpace = async () => {
    setIsLoading(true);

    if (!spaceId) {
      return;
    }

    try {
      await API.deleteSpace(spaceId);
      await userStore.getSpaces();
      toast.success("Space deleted");
      navigate("/");
    } catch (error) {
      toast.error(`Error while deleting space! ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setIsLoading(true);

    if (!spaceId) {
      return;
    }

    const space = {
      id: spaceId,
      name: name.trim(),
      description: description.trim(),
      memberEmails,
      groups,
    };

    try {
      const { data } = await API.updateSpace(space);
      setDataToState(data);
      await userStore.getSpaces();
      navigate(-1);
    } catch (error) {
      toast.error(`Error while updating space! ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  const onDelete = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event.preventDefault();

    openModal(`Are you sure you want to delete space "${name}"?`, () => {
      deleteSpace();
      closeModal();
    });
  };

  useLayoutEffect(() => {
    const getSpace = async () => {
      if (!spaceId) {
        return;
      }

      setIsLoading(true);

      try {
        const { data } = await API.getSpaceById(spaceId);
        setDataToState(data);
      } catch (error) {
        toast.error(`Error getting space info! ${error}`);
      } finally {
        setIsLoading(false);
      }
    };

    getSpace();
  }, [spaceId]);

  if (isLoading) {
    return (
      <div className="board board-loading">
        <Loading />
      </div>
    );
  }

  return (
    <div className="board">
      <ButtonBack title="Back to space" to={`/${spaceId}`} />

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
          <label className="form__label form__label-small">Member Emails</label>

          <StringArrayInput
            array={memberEmails}
            onChangeArray={setMemberEmails}
            defaultValue={userStore.email}
            placeholder="Add member email"
          />
        </div>

        <button type="submit" className="form__button">
          Update space
        </button>

        <button
          type="button"
          className="form__button form__button-delete"
          onClick={onDelete}
        >
          Delete space
        </button>
      </form>

      {isVisible && modalOptions && (
        <Modal
          text={modalOptions.text}
          onOk={modalOptions.onOk}
          onCancel={closeModal}
        />
      )}
    </div>
  );
};

export default observer(EditSpace);
