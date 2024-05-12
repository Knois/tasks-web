import Loading from "components/shared/Loading";
import { useClickOutside } from "hooks/useClickOutside";
import { useStore } from "hooks/useStore";
import { observer } from "mobx-react-lite";
import { useLayoutEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

import IconSelect from "./ui/IconSelect";

const SelectSpaces = () => {
  const { userStore } = useStore();

  const [isOpen, setIsOpen] = useState(false);

  const [isLoading, setIsLoading] = useState(false);

  const handleClick = () => setIsOpen((s) => !s);

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
              {userStore.spaces.map((space) => (
                <div className="select__dropdown__item" key={space.id}>
                  {space.name}
                </div>
              ))}

              {userStore.spaces.length === 0 && <div>No spaces yet</div>}

              <Link to="/create-space">
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
