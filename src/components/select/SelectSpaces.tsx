import IconSelect from "components/shared/icons/IconSelect";
import Loading from "components/shared/Loading";
import { useClickOutside } from "hooks/useClickOutside";
import { useStore } from "hooks/useStore";
import { observer } from "mobx-react-lite";
import { useLayoutEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

const SelectSpaces = () => {
  const { userStore } = useStore();

  const [isOpen, setIsOpen] = useState(false);

  const [isLoading, setIsLoading] = useState(false);

  const handleClick = () => setIsOpen((s) => !s);

  const closeDropdown = () => setIsOpen(false);

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

        <IconSelect isOpen={isOpen} />
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
                    to={`/space/${space.id}`}
                    onClick={closeDropdown}
                    key={space.id}
                    className="select__dropdown__item"
                  >
                    {space.name}
                  </Link>
                ))}
              </div>

              {userStore.spaces.length === 0 && <div>No spaces yet</div>}

              <Link to="/create-space" onClick={closeDropdown}>
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
