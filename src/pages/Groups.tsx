import API from "api/api";
import ButtonBack from "components/buttons/ButtonBack";
import CardAddNew from "components/cards/CardAddNew";
import CardGroup from "components/cards/CardGroup";
import Loading from "components/shared/Loading";
import { useStore } from "hooks/useStore";
import { observer } from "mobx-react-lite";
import { useLayoutEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { ISpace } from "types/Space";

const ButtonEditSpace = () => (
  <Link to="edit-space">
    <button type="button" className="form__button form__button-small">
      Edit space
    </button>
  </Link>
);

const Groups = () => {
  const { spaceId } = useParams();
  const { userStore } = useStore();

  const [space, setSpace] = useState<ISpace | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const groups = space?.groups.map((group) => (
    <CardGroup group={group} key={group.id} />
  ));

  useLayoutEffect(() => {
    const getSpace = async () => {
      if (!spaceId) {
        setSpace(null);
        return;
      }

      setIsLoading(true);

      try {
        const { data } = await API.getSpaceById(spaceId);
        setSpace(data);
      } catch (error) {
        toast.error(`Error while getting space! ${error}`);
        setSpace(null);
      } finally {
        setIsLoading(false);
      }
    };

    getSpace();
  }, [spaceId]);

  if (isLoading) {
    return (
      <div className="board board-loading">
        <Loading />
      </div>
    );
  }

  return (
    <div className="board">
      <ButtonBack title="Back to spaces list" to="/" />

      <span className="board__title">{space?.name}</span>

      <div className="board__row">
        <span className="board__title">Groups</span>

        {space?.creatorEmail === userStore.email && <ButtonEditSpace />}
      </div>

      <div className="board__list">
        {groups}

        <CardAddNew to="create-group" />
      </div>

      <span className="board__description">{space?.description}</span>
    </div>
  );
};

export default observer(Groups);
