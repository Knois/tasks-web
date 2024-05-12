import API from "api/api";
import StringArrayInput from "components/input/StringArrayInput";
import Header from "components/shared/Header";
import { useStore } from "hooks/useStore";
import { observer } from "mobx-react-lite";
import { useState } from "react";

const CreateSpace = () => {
  const { userStore } = useStore();

  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [memberEmails, setMemberEmails] = useState<string[]>([]);

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      await API.createSpace({ name, description, memberEmails });
      await userStore.getSpaces();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <Header />

      <form className="form" onSubmit={onSubmit}>
        <div className="form__box form__box-small">
          <label className="form__label form__label-small">Name</label>

          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="form__input form__input-long"
          />
        </div>

        <div className="form__box form__box-small">
          <label className="form__label form__label-small">Description</label>

          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            className="form__input form__input-long"
          />
        </div>

        <div className="form__box form__box-small">
          <label className="form__label form__label-small">Member Emails</label>

          <StringArrayInput value={memberEmails} onChange={setMemberEmails} />
        </div>

        <button type="submit" className="form__button">
          Create space
        </button>
      </form>
    </>
  );
};

export default observer(CreateSpace);
