import API from "api/api";
import SelectMulti from "components/select/SelectMulti";
import Loading from "components/shared/Loading";
import { memo, useLayoutEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { IGroup } from "types/Group";
import { ISpace } from "types/Space";

const CreateGroup = () => {
  const { spaceId } = useParams();

  const navigate = useNavigate();

  const [name, setName] = useState<IGroup["name"]>("");
  const [memberEmails, setMemberEmails] = useState<IGroup["memberEmails"]>([]);

  const [availableMemberEmails, setAvailableMemberEmails] = useState<
    ISpace["memberEmails"]
  >([]);

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
      toast.success("Group created");
      navigate(-1);
    } catch (error) {
      console.log(error);
      setIsError(true);
      toast.error("Error while creating group");
    } finally {
      setIsLoading(false);
    }
  };

  useLayoutEffect(() => {
    //get space info and set available member emails
    const getSpace = async () => {
      if (!spaceId) {
        return;
      }

      setIsLoading(true);

      try {
        const { data } = await API.getSpaceById(spaceId);
        setAvailableMemberEmails(data.memberEmails);
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

        <SelectMulti
          values={memberEmails}
          options={availableMemberEmails}
          setValues={setMemberEmails}
        />
      </div>

      <button type="submit" className="form__button">
        Create group
      </button>
    </form>
  );
};

export default memo(CreateGroup);
