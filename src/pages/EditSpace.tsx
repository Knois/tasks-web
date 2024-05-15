import API from "api/api";
import StringArrayInput from "components/input/StringArrayInput";
import Loading from "components/shared/Loading";
import { useStore } from "hooks/useStore";
import { observer } from "mobx-react-lite";
import { useLayoutEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { IGroup } from "types/Group";
import { ISpace } from "types/Space";

const EditSpace = () => {
  const { spaceId } = useParams();

  const { userStore } = useStore();

  const [id, setId] = useState(spaceId);
  const [name, setName] = useState<ISpace["name"]>("");
  const [description, setDescription] = useState<ISpace["description"]>("");
  const [memberEmails, setMemberEmails] = useState<ISpace["memberEmails"]>([]);
  const [groups, setGroups] = useState<ISpace["groups"]>([]);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);
  const [isOk, setIsOk] = useState<boolean>(false);
  const [isDeleted, setIsDeleted] = useState<boolean>(false);

  const setDataToState = (data: ISpace) => {
    setId(data.id);
    setName(data.name);
    setDescription(data.description);
    setMemberEmails(data.memberEmails);
    setGroups(data.groups);
  };

  const setFormState = () => {
    setIsLoading(true);
    setIsError(false);
    setIsOk(false);
  };

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setFormState();

    if (!id) {
      return;
    }

    try {
      const space = { id, name, description, memberEmails, groups };

      console.log(space);

      const { data } = await API.updateSpace(space);
      setDataToState(data);
      await userStore.getSpaces();
      setIsOk(true);
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

    if (!id) {
      return;
    }

    try {
      await API.deleteSpace(id);
      await userStore.getSpaces();
      setIsDeleted(true);
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
    return (
      <div className="screenbox screenbox-headed">
        <Loading />
      </div>
    );
  }

  if (isDeleted) {
    return (
      <div className="screenbox screenbox-headed">
        <span className="form__success">Space deleted!</span>
      </div>
    );
  }

  return (
    <div className="screenbox screenbox-headed">
      <form className="form" onSubmit={onSubmit}>
        {isError && (
          <span className="form__error">Error while changing space</span>
        )}

        {isOk && <span className="form__success">Success!</span>}

        <div className="form__box form__box-small">
          <label className="form__label form__label-small">Name</label>

          <input
            type="text"
            value={name}
            onChange={({ target: { value } }) => setName(value)}
            required
            className="form__input form__input-long"
          />
        </div>

        <div className="form__box form__box-small">
          <label className="form__label form__label-small">Description</label>

          <input
            type="text"
            value={description}
            onChange={({ target: { value } }) => setDescription(value)}
            required
            className="form__input form__input-long"
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
    </div>
  );
};

export default observer(EditSpace);
