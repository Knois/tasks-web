import API from "api/api";
import StringArrayInput from "components/input/StringArrayInput";
import Loading from "components/shared/Loading";
import { useStore } from "hooks/useStore";
import { observer } from "mobx-react-lite";
import { useLayoutEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { IGroup } from "types/Group";

const EditGroup = () => {
  const { groupId } = useParams();

  const { userStore } = useStore();

  const [id, setId] = useState<IGroup["id"]>(groupId ?? "");

  const [name, setName] = useState<IGroup["name"]>("");
  const [memberEmails, setMemberEmails] = useState<IGroup["memberEmails"]>([]);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);
  const [isOk, setIsOk] = useState<boolean>(false);
  const [isDeleted, setIsDeleted] = useState<boolean>(false);

  const setDataToState = (data: IGroup) => {
    setId(data.id);
    setName(data.name);
    setMemberEmails(data.memberEmails);
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

    const group = {
      name: name.trim(),
      memberEmails,
    };

    try {
      const { data } = await API.updateGroup(group, id);
      setDataToState(data);
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
      await API.deleteGroup(id);
      setIsDeleted(true);
    } catch (error) {
      console.log(error);
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  useLayoutEffect(() => {
    const getGroup = async () => {
      if (!groupId) {
        return;
      }

      setIsLoading(true);

      try {
        const { data } = await API.getGroupById(groupId);
        setDataToState(data);
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
      <div className="screenbox screenbox-headed">
        <Loading />
      </div>
    );
  }

  if (isDeleted) {
    return (
      <div className="screenbox screenbox-headed">
        <span className="form__success">Group deleted!</span>
      </div>
    );
  }

  return (
    <div className="screenbox screenbox-headed">
      <form className="form" onSubmit={onSubmit}>
        {isError && (
          <span className="form__error">Error while changing group</span>
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
            maxLength={255}
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
          Update group
        </button>
      </form>

      <button type="button" className="form__button" onClick={onDelete}>
        Delete group
      </button>
    </div>
  );
};

export default observer(EditGroup);
