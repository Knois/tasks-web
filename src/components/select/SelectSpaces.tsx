import IconExpandVertical from "components/shared/icons/IconExpandVertical";
import Loading from "components/shared/Loading";
import { useClickOutside } from "hooks/useClickOutside";
import { useStore } from "hooks/useStore";
import { observer } from "mobx-react-lite";
import { useLayoutEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

const SelectSpaces = () => {
  const { userStore } = useStore();

  const [isOpen, setIsOpen] = useState(false);

  const handleClick = () => setIsOpen((s) => !s);

  const handleSelect = () => setIsOpen(false);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);

  useClickOutside(dropdownRef, rootRef, () => {
    setIsOpen(false);
  });

  useLayoutEffect(() => {
    const getSpaces = async () => {
      await userStore.getSpaces();
    };

    getSpaces();
  }, [userStore]);

  return (
    <div className="select">
      <div
        className={`select__root select__root-header ${isOpen ? "select__root-open" : ""}`}
        onClick={handleClick}
        ref={rootRef}
      >
        <span className="select__label">Spaces</span>

        <IconExpandVertical isOpen={isOpen} />
      </div>

      {isOpen && (
        <div className="select__dropdown" ref={dropdownRef}>
          {userStore.isLoadingSpaces ? (
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
                    <span className="select__dropdown__item__label">
                      {space.name}
                    </span>
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
