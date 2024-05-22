import API from "api/api";
import { ReactComponent as Edit } from "assets/svg/edit.svg";
import { ReactComponent as Settings } from "assets/svg/settings.svg";
import IconExpandHorizontal from "components/shared/icons/IconExpandHorizontal";
import React from "react";
import { Link, useParams } from "react-router-dom";
import { ISpace } from "types/Space";

type Props = {
  isExpanded: boolean;
  setIsExpanded: React.Dispatch<React.SetStateAction<boolean>>;
};

const Sidebar: React.FC<Props> = ({ isExpanded, setIsExpanded }) => {
  const { spaceId, groupId } = useParams();

  const [space, setSpace] = React.useState<null | ISpace>(null);

  React.useLayoutEffect(() => {
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
                    <Edit />
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
            <Settings />
          </Link>
        )}

        <div className="sidebar__tools__button" onClick={handleExpandSidebar}>
          <IconExpandHorizontal isOpen={isExpanded} />
        </div>
      </div>
    </aside>
  );
};

export default React.memo(Sidebar);
