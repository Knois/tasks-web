import API from "api/api";
import { ReactComponent as Edit } from "assets/svg/edit.svg";
import { ReactComponent as Settings } from "assets/svg/settings.svg";
import IconExpandHorizontal from "components/shared/icons/IconExpandHorizontal";
import { useStore } from "hooks/useStore";
import { observer } from "mobx-react-lite";
import React from "react";
import { Link, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { ISpace } from "types/Space";

const Sidebar = () => {
  const { spaceId, groupId } = useParams();

  const { appStore } = useStore();

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
        toast.error(`Error while getting space! ${error}`);
      }
    };

    getSpace();
  }, [spaceId]);

  const sidebarClassName = !appStore.isExpandedSidebar
    ? "sidebar sidebar-collapsed"
    : "sidebar";

  const handleExpandSidebar = () => {
    appStore.setIsExpandedSidebar(!appStore.isExpandedSidebar);
  };

  return (
    <aside className={sidebarClassName}>
      <div className="sidebar__info">
        {appStore.isExpandedSidebar && (
          <>
            {space?.name && (
              <div className="sidebar__info__name">{space.name}</div>
            )}

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
        {appStore.isExpandedSidebar && (
          <Link
            to={`/${spaceId}/edit-space`}
            className="sidebar__tools__button"
          >
            <Settings />
          </Link>
        )}

        <div className="sidebar__tools__button" onClick={handleExpandSidebar}>
          <IconExpandHorizontal isOpen={appStore.isExpandedSidebar} />
        </div>
      </div>
    </aside>
  );
};

export default observer(Sidebar);
