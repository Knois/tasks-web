import API from "api/api";
import { useClickOutside } from "hooks/useClickOutside";
import { useLayoutEffect, useRef, useState } from "react";
import { ISpace } from "types/Space";

import IconSelect from "./IconSelect";
import Loading from "./Loading";

const SelectSpaces = () => {
  const [isOpen, setIsOpen] = useState(false);

  const [isLoading, setIsLoading] = useState(false);

  const [spaces, setSpaces] = useState<ISpace[]>([]);

  const handleClick = () => setIsOpen((s) => !s);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);

  useClickOutside(dropdownRef, rootRef, () => {
    setIsOpen(false);
  });

  useLayoutEffect(() => {
    const getSpaces = async () => {
      setIsLoading(true);

      try {
        const { data } = await API.getSpaces();
        setSpaces(data);
      } finally {
        setIsLoading(false);
      }
    };

    getSpaces();
  }, []);

  return (
    <div className="select">
      <div
        className={`select__root ${isOpen ? "select__root-open" : ""}`}
        onClick={handleClick}
        ref={rootRef}
      >
        Пространства
        <IconSelect isOpen={isOpen} />
      </div>

      {isOpen && (
        <div className="select__dropdown" ref={dropdownRef}>
          {isLoading ? (
            <Loading />
          ) : (
            <>
              {spaces.map((space) => (
                <div className="select__dropdown__item" key={space.id}>
                  {space.name}
                </div>
              ))}

              <div className="add-space">Добавить пространство</div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default SelectSpaces;
