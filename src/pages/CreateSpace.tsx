import API from "api/api";
import StringArrayInput from "components/input/StringArrayInput";
import Loading from "components/shared/Loading";
import useAutoResizeTextarea from "hooks/useAutoResizeTextarea";
import { useStore } from "hooks/useStore";
import { observer } from "mobx-react-lite";
import { useState } from "react";
import { ISpace } from "types/Space";

const CreateSpace = () => {
  const { userStore } = useStore();

  const [name, setName] = useState<ISpace["name"]>("");
  const [description, setDescription] = useState<ISpace["description"]>("");
  const [memberEmails, setMemberEmails] = useState<ISpace["memberEmails"]>([]);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);
  const [isOk, setIsOk] = useState<boolean>(false);

  const textareaRef = useAutoResizeTextarea(description);

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setIsLoading(true);
    setIsError(false);

    const space = {
      name: name.trim(),
      description: description.trim(),
      memberEmails,
    };

    try {
      await API.createSpace(space);
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
    setDescription("");
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
          Add another space
        </button>
      </div>
    );
  }

  return (
    <div className="screenbox screenbox-headed">
      <form className="form" onSubmit={onSubmit}>
        {isError && (
          <span className="form__error">Error while creating space</span>
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
            placeholder="Add member email"
          />
        </div>

        <button type="submit" className="form__button">
          Create space
        </button>
      </form>
    </div>
  );
};

export default observer(CreateSpace);
