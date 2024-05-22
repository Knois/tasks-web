import IconExpandVertical from "components/shared/icons/IconExpandVertical";
import Loading from "components/shared/Loading";
import { useClickOutside } from "hooks/useClickOutside";
import { useStore } from "hooks/useStore";
import { observer } from "mobx-react-lite";
import { useLayoutEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

const SelectSpaces = () => {
  const { userStore, appStore } = useStore();

  const [isOpen, setIsOpen] = useState(false);

  const [isLoading, setIsLoading] = useState(false);

  const handleClick = () => setIsOpen((s) => !s);

  const handleSelect = () => {
    appStore.setIsExpandedSidebar(true);
    setIsOpen(false);
  };

  const dropdownRef = useRef<HTMLDivElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);

  useClickOutside(dropdownRef, rootRef, () => {
    setIsOpen(false);
  });

  useLayoutEffect(() => {
    const getSpaces = async () => {
      setIsLoading(true);

      await userStore.getSpaces();

      setIsLoading(false);
    };

    getSpaces();
  }, [userStore]);

  return (
    <div className="select">
      <div
        className={`select__root ${isOpen ? "select__root-open" : ""}`}
        onClick={handleClick}
        ref={rootRef}
      >
        <span className="select__label">Spaces</span>

        <IconExpandVertical isOpen={isOpen} />
      </div>

      {isOpen && (
        <div className="select__dropdown" ref={dropdownRef}>
          {isLoading ? (
            <Loading />
          ) : (
            <>
              <div className="select__dropdown__list">
                {userStore.spaces.map((space) => (
                  <Link
                    to={`/${space.id}`}
                    onClick={handleSelect}
                    key={space.id}
                    className="select__dropdown__item"
                  >
                    {space.name}
                  </Link>
                ))}
              </div>

              {userStore.spaces.length === 0 && <div>No spaces yet</div>}

              <Link to="/create-space" onClick={() => setIsOpen(false)}>
                <div className="add-space">Create space</div>
              </Link>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default observer(SelectSpaces);
