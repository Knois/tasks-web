import API from "api/api";
import StringArrayInput from "components/input/StringArrayInput";
import Loading from "components/shared/Loading";
import useAutoResizeTextarea from "hooks/useAutoResizeTextarea";
import { useStore } from "hooks/useStore";
import { observer } from "mobx-react-lite";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { ISpace } from "types/Space";

const CreateSpace = () => {
  const { userStore } = useStore();

  const navigate = useNavigate();

  const [name, setName] = useState<ISpace["name"]>("");
  const [description, setDescription] = useState<ISpace["description"]>("");
  const [memberEmails, setMemberEmails] = useState<ISpace["memberEmails"]>([]);

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const textareaRef = useAutoResizeTextarea(description);

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setIsLoading(true);

    const space = {
      name: name.trim(),
      description: description.trim(),
      memberEmails,
    };

    try {
      const { data } = await API.createSpace(space);
      await userStore.getSpaces();
      toast.success("Space created");
      navigate(`/${data.id}`);
    } catch (error) {
      toast.error(`Error while creating space! ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="board board-loading">
        <Loading />
      </div>
    );
  }

  return (
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
  );
};

export default observer(CreateSpace);
