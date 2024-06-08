import API from "api/api";
import ButtonBack from "components/buttons/ButtonBack";
import CardAddNew from "components/cards/CardAddNew";
import CardGroup from "components/cards/CardGroup";
import Loading from "components/shared/Loading";
import { observer } from "mobx-react-lite";
import { useLayoutEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { ISpace } from "types/Space";

const Groups = () => {
  const { spaceId } = useParams();

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
      <ButtonBack title="Back to spaces" />

      <span className="board__title">Groups</span>

      <div className="board__list">
        {groups}

        <CardAddNew to="create-group" />
      </div>
    </div>
  );
};

export default observer(Groups);
