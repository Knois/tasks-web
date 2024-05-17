import API from "api/api";
import { useLayoutEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ISpace } from "types/Space";

import IconEdit from "./shared/icons/IconEdit";
import IconExpandHorizontal from "./shared/icons/IconExpandHorizontal";
import IconSettings from "./shared/icons/IconSettings";

const Sidebar = () => {
  const { spaceId, groupId } = useParams();

  const [space, setSpace] = useState<null | ISpace>(null);

  useLayoutEffect(() => {
    const getSpace = async () => {
      if (!spaceId) {
        return;
      }

      try {
        const { data } = await API.getSpaceById(spaceId);
        setSpace(data);
      } catch (error) {
        console.log(error);
      }
    };

    getSpace();
  }, [spaceId]);

  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  const sidebarClassName = isExpanded ? "sidebar sidebar-collapsed" : "sidebar";

  const handleExpandSidebar = () => {
    setIsExpanded((s) => !s);
  };

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
                  className={`sidebar__info__item ${groupId === group.id ? "sidebar__info__item-active" : ""}`}
                >
                  <div className="sidebar__info__item__name">{group.name}</div>

                  <Link
                    to={`/${spaceId}/${group.id}/edit-group`}
                    className="sidebar__info__item__edit"
                  >
                    <IconEdit />
                  </Link>
                </Link>
              ))}
            </div>

            <Link to={`/${spaceId}/create-group`}>
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

export default Sidebar;
