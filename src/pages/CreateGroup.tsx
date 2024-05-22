import API from "api/api";
import StringArrayInput from "components/input/StringArrayInput";
import Loading from "components/shared/Loading";
import { memo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { IGroup } from "types/Group";

const CreateGroup = () => {
  const { spaceId } = useParams();

  const navigate = useNavigate();

  const [name, setName] = useState<IGroup["name"]>("");
  const [memberEmails, setMemberEmails] = useState<IGroup["memberEmails"]>([]);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);

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
      navigate(-1);
    } catch (error) {
      console.log(error);
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
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
          maxLength={255}
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
  );
};

export default memo(CreateGroup);
