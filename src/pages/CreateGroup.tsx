import API from "api/api";
import StringArrayInput from "components/input/StringArrayInput";
import Loading from "components/shared/Loading";
import { useStore } from "hooks/useStore";
import { observer } from "mobx-react-lite";
import { useState } from "react";
import { useParams } from "react-router-dom";

const CreateGroup = () => {
  const { spaceId } = useParams();

  const { userStore } = useStore();

  const [name, setName] = useState<string>("");
  const [memberEmails, setMemberEmails] = useState<string[]>([]);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);
  const [isOk, setIsOk] = useState<boolean>(false);

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!spaceId) {
      return;
    }

    setIsLoading(true);
    setIsError(false);

    const group = { name, memberEmails, spaceId };

    try {
      await API.createGroup(group);
      await userStore.getSpaces();
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
    setMemberEmails([]);
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
          Add another group
        </button>
      </div>
    );
  }

  return (
    <div className="screenbox screenbox-headed">
      <form className="form" onSubmit={onSubmit}>
        {isError && (
          <span className="form__error">Error while creating group</span>
        )}

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
          <label className="form__label form__label-small">Member Emails</label>

          <StringArrayInput
            array={memberEmails}
            onChangeArray={setMemberEmails}
            placeholder="Add member email"
          />
        </div>

        <button type="submit" className="form__button">
          Create group
        </button>
      </form>
    </div>
  );
};

export default observer(CreateGroup);
