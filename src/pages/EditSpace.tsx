import API from "api/api";
import StringArrayInput from "components/input/StringArrayInput";
import Loading from "components/shared/Loading";
import useAutoResizeTextarea from "hooks/useAutoResizeTextarea";
import { useStore } from "hooks/useStore";
import { observer } from "mobx-react-lite";
import { useLayoutEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
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
  const [isError, setIsError] = useState<boolean>(false);

  const textareaRef = useAutoResizeTextarea(description);

  const setDataToState = (data: ISpace) => {
    setName(data.name);
    setDescription(data.description);
    setMemberEmails(data.memberEmails);
    setGroups(data.groups);
  };

  const setFormState = () => {
    setIsLoading(true);
    setIsError(false);
  };

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setFormState();

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
      console.log(error);
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  const onDelete = async (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    event.preventDefault();

    setFormState();

    if (!spaceId) {
      return;
    }

    try {
      await API.deleteSpace(spaceId);
      await userStore.getSpaces();
      navigate(-1);
    } catch (error) {
      console.log(error);
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
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
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };

    getSpace();
  }, [spaceId]);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <>
      <form className="form" onSubmit={onSubmit}>
        {isError && (
          <span className="form__error">Error while changing space</span>
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
      </form>

      <button type="button" className="form__button" onClick={onDelete}>
        Delete space
      </button>
    </>
  );
};

export default observer(EditSpace);
