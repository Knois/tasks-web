import API from "api/api";
import Loading from "components/shared/Loading";
import { useLayoutEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ISpace } from "types/Space";

const Space = () => {
  const { spaceId } = useParams();

  const [space, setSpace] = useState<null | ISpace>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useLayoutEffect(() => {
    const getSpace = async () => {
      if (!spaceId) {
        return;
      }

      setIsLoading(true);

      try {
        const response = await API.getSpaceById(spaceId);
        setSpace(response.data);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };

    getSpace();
  }, [spaceId]);

  if (isLoading) {
    return (
      <aside className="sidebar sidebar-loading">
        <Loading />
      </aside>
    );
  }

  return (
    <aside className="sidebar">
      <div className="sidebar__name">{space?.name}</div>
      <div className="sidebar__description">{space?.description}</div>
    </aside>
  );
};

export default Space;
