import API from "api/api";
import IconExpandHorizontal from "components/shared/icons/IconExpandHorizontal";
import IconSettings from "components/shared/icons/IconSettings";
import Loading from "components/shared/Loading";
import { memo, useLayoutEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ISpace } from "types/Space";

const Dashboard = () => {
  const { spaceId } = useParams();

  const [space, setSpace] = useState<null | ISpace>(null);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  const handleExpandSidebar = () => {
    setIsExpanded((s) => !s);
  };

  const sidebarClassName = isExpanded ? "sidebar sidebar-collapsed" : "sidebar";

  useLayoutEffect(() => {
    const getSpace = async () => {
      if (!spaceId) {
        return;
      }

      setIsLoading(true);

      try {
        const { data } = await API.getSpaceById(spaceId);
        setSpace(data);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };

    getSpace();
  }, [spaceId]);

  if (isLoading && !isExpanded) {
    return (
      <aside className={sidebarClassName}>
        <Loading />
      </aside>
    );
  }

  return (
    <aside className={sidebarClassName}>
      <div className="sidebar__info">
        {!isExpanded && (
          <>
            <div className="sidebar__info__name">{space?.name}</div>

            {space?.description && (
              <div className="sidebar__info__description">
                {space.description}
              </div>
            )}

            <div className="sidebar__info__list">
              {space?.groups.map((group) => (
                <Link
                  to={`/${spaceId}/${group.id}`}
                  key={group.id}
                  className="sidebar__info__item"
                >
                  {group.name}
                </Link>
              ))}
            </div>

            <Link to="create-group">
              <button className="form__button form__button-small">
                Add group
              </button>
            </Link>
          </>
        )}
      </div>

      <div className="sidebar__tools">
        {!isExpanded && (
          <Link
            to={`/${spaceId}/edit-space`}
            className="sidebar__tools__button"
          >
            <IconSettings />
          </Link>
        )}

        <div className="sidebar__tools__button" onClick={handleExpandSidebar}>
          <IconExpandHorizontal isOpen={isExpanded} />
        </div>
      </div>
    </aside>
  );
};

export default memo(Dashboard);
