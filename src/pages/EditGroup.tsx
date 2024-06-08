import API from "api/api";
import SelectMulti from "components/select/SelectMulti";
import Loading from "components/shared/Loading";
import Modal from "components/shared/Modal";
import { useModal } from "hooks/useModal";
import { memo, useLayoutEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { IGroup } from "types/Group";
import { ISpace } from "types/Space";

const EditGroup = () => {
  const { spaceId, groupId } = useParams();

  const navigate = useNavigate();

  const [name, setName] = useState<IGroup["name"]>("");
  const [memberEmails, setMemberEmails] = useState<IGroup["memberEmails"]>([]);

  const [availableMemberEmails, setAvailableMemberEmails] = useState<
    ISpace["memberEmails"]
  >([]);

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const { isVisible, modalOptions, openModal, closeModal } = useModal();

  const setDataToState = (data: IGroup) => {
    setName(data.name);
    setMemberEmails(data.memberEmails);
  };

  const deleteGroup = async () => {
    setIsLoading(true);

    if (!groupId) {
      return;
    }

    try {
      await API.deleteGroup(groupId);
      toast.success("Group deleted");
      navigate(-1);
    } catch (error) {
      toast.error(`Error while editing group! ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setIsLoading(true);

    if (!groupId) {
      return;
    }

    const group = {
      name: name.trim(),
      memberEmails,
    };

    try {
      const { data } = await API.updateGroup(group, groupId);
      setDataToState(data);
      navigate(-1);
    } catch (error) {
      toast.error(`Error while updating group! ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  const onDelete = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event.preventDefault();

    openModal(`Are you sure you want to delete group "${name}"?`, () => {
      deleteGroup();
      closeModal();
    });
  };

  useLayoutEffect(() => {
    //get space info and set available member emails
    const getSpace = async () => {
      if (!spaceId) {
        return;
      }

      try {
        const { data } = await API.getSpaceById(spaceId);
        setAvailableMemberEmails(data.memberEmails);
      } catch (error) {
        console.log(error);
      }
    };

    const getGroup = async () => {
      if (!groupId || !spaceId) {
        return;
      }

      setIsLoading(true);

      try {
        const { data } = await API.getGroupById(groupId);
        setDataToState(data);
        await getSpace();
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };

    getGroup();
  }, [groupId, spaceId]);

  if (isLoading) {
    return (
      <div className="board board-loading">
        <Loading />
      </div>
    );
  }

  return (
    <>
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
          <label className="form__label form__label-small">Member Emails</label>

          <SelectMulti
            values={memberEmails}
            options={availableMemberEmails}
            setValues={setMemberEmails}
          />
        </div>

        <button type="submit" className="form__button">
          Update group
        </button>
      </form>

      <button type="button" className="form__button" onClick={onDelete}>
        Delete group
      </button>

      {isVisible && modalOptions && (
        <Modal
          text={modalOptions.text}
          onOk={modalOptions.onOk}
          onCancel={closeModal}
        />
      )}
    </>
  );
};

export default memo(EditGroup);
