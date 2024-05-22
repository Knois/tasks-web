import { ReactComponent as ArrowLeft } from "assets/svg/calendar_arrow_left.svg";
import { ReactComponent as ArrowRight } from "assets/svg/calendar_arrow_right.svg";
import TimePicker from "components/shared/TimePicker";
import React from "react";
import { getRangeEndYear, getRangeStartYear } from "utils";

//настройки таймпикера
const quantity = 16; //количество ячеек на колесе
const deltaYToRollItem = 70; //расстояние deltaX для поворота колеса на 1 ячейку
const itemDegree = 360 / quantity; //сколько градусов занимает 1 ячейка на колесе
const koef = itemDegree / deltaYToRollItem; //коэффециент на который надо умножить расстояние чтобы получить кол-во градусов
const touchSpeed = 1.2; //скорость прокруткии при сенсорном экране
const postMoveDelay = 300; //задержка после прокрутки в ms

const closestToDivideBy = (
  number: number,
): { value: number; direction: boolean } => {
  const roundedValue = Math.round(number / deltaYToRollItem);
  const direction = roundedValue > number / deltaYToRollItem ? true : false;
  return { value: roundedValue, direction: direction };
};

const daysInMonth = (date: Date) =>
  new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();

type Item = {
  value: number;
  rotateX: number;
  defaultValue: number;
};

const options: Item[] = Array.from({ length: quantity }, (_, i) => ({
  value: i,
  rotateX: i * -itemDegree + (180 - itemDegree),
  defaultValue: i,
}));

const getImmutableOptions = (): Item[] => {
  return options.map((option) => ({
    ...option,
  }));
};

const getHours = (date: Date | null) => (date ? date.getHours() : 0);
const getMinutes = (date: Date | null) => (date ? date.getMinutes() : 0);

//обновить значения колеса
const updateWheelItems = (
  value: number,
  maxValue: number,
  setFunction: React.Dispatch<React.SetStateAction<Item[]>>,
  array?: Item[],
) => {
  if (value !== null) {
    const foundIndex = options.findIndex((newItem) => newItem.rotateX === 0);

    const newItems = options.map((newItem, index) => {
      const newValue = (value - (foundIndex - index) + maxValue) % maxValue;
      return {
        rotateX: array ? array[index].rotateX - itemDegree : newItem.rotateX,
        value: newValue,
        defaultValue: newValue,
      };
    });

    setFunction(newItems);
  }
};

interface Props {
  selectedDate: Date;
  setSelectedDate: (date: Date) => void;
}

const Calendar: React.FC<Props> = ({ selectedDate, setSelectedDate }) => {
  const [currentDate, setCurrentDate] = React.useState<Date>(selectedDate);

  const [isSelectingMonth, setIsSelectingMonth] =
    React.useState<boolean>(false);
  const [isSelectingYear, setIsSelectingYear] = React.useState<boolean>(false);

  const [startYear, setStartYear] = React.useState<number>(
    getRangeStartYear(currentDate.getFullYear()),
  );
  const [endYear, setEndYear] = React.useState<number>(
    getRangeEndYear(currentDate.getFullYear()),
  );

  const months = Array.from(
    { length: 12 },
    (_, i) => new Date(currentDate.getFullYear(), i, 1),
  );

  const [hour, setHour] = React.useState<number>(options[7].value);
  const [minutes, setMinutes] = React.useState<number>(options[7].value);

  const [itemsHours, setItemsHours] = React.useState<Item[]>(
    getImmutableOptions(),
  );
  const [itemsMinutes, setItemsMinutes] = React.useState<Item[]>(
    getImmutableOptions(),
  );

  const [isReady, setIsReady] = React.useState<boolean>(false);

  const [isTouchingHours, setIsTouchingHours] = React.useState<boolean>(false);
  const [isScrollingHours, setIsScrollingHours] =
    React.useState<boolean>(false);
  const [isTouchingMinutes, setIsTouchingMinutes] =
    React.useState<boolean>(false);
  const [isScrollingMinutes, setIsScrollingMinutes] =
    React.useState<boolean>(false);

  const timerHoursRef = React.useRef<NodeJS.Timeout | null>(null);
  const sumDeltaYScrollHoursRef = React.useRef<number>(0);
  const endTouchYHoursRef = React.useRef<number>(0);
  const startTouchYHoursRef = React.useRef<number>(0);

  const [checkHours, setCheckHours] = React.useState<boolean>(false);

  const timerMinutesRef = React.useRef<NodeJS.Timeout | null>(null);
  const sumDeltaYScrollMinutesRef = React.useRef<number>(0);
  const endTouchYMinutesRef = React.useRef<number>(0);
  const startTouchYMinutesRef = React.useRef<number>(0);

  const [checkMinutes, setCheckMinutes] = React.useState<boolean>(false);

  const postMoveHours = React.useCallback(() => {
    const params = closestToDivideBy(sumDeltaYScrollHoursRef.current);
    let newHour = (hour + params.value) % 24;

    if (newHour < 0) {
      newHour += 24;
    }

    if (newHour > 23) {
      newHour -= 24;
    }

    setHour(newHour);

    setItemsHours((s) => {
      const newItems = s.map((item) => {
        let newValue = item.value;

        const newRotation = Math.round(item.rotateX / itemDegree) * itemDegree;

        if (newRotation > 0) {
          if (
            (newRotation % 360) - 180 >= 0 &&
            (newRotation % 360) - 180 < 360
          ) {
            const k = Math.floor(newRotation / 360) + 1;
            newValue = (item.defaultValue + quantity * k + 24) % 24;
          } else {
            const k = Math.floor(newRotation / 360);
            newValue = (item.defaultValue + quantity * k + 24) % 24;
          }
        } else {
          if (
            (newRotation % 360) + 180 < 0 &&
            (newRotation % 360) + 180 > -360
          ) {
            const k = Math.floor(newRotation / -360) + 1;
            newValue = (item.defaultValue - quantity * k + 24 * k) % 24;
          } else {
            const k = Math.floor(newRotation / -360);
            newValue = (item.defaultValue - quantity * k + 24 * k) % 24;
          }
        }

        return {
          rotateX: newRotation,
          value: newValue,
          defaultValue: item.defaultValue,
        };
      });

      return newItems;
    });

    sumDeltaYScrollHoursRef.current = 0;
    setIsScrollingHours(false);
    setCheckHours(true);
  }, [hour]);

  const postMoveMinutes = React.useCallback(() => {
    const params = closestToDivideBy(sumDeltaYScrollMinutesRef.current);
    let newMinutes = (minutes + params.value) % 60;

    if (newMinutes < 0) {
      newMinutes += 60;
    }

    if (newMinutes > 59) {
      newMinutes -= 60;
    }

    setMinutes(newMinutes);

    setItemsMinutes((s) => {
      const newItems = s.map((item) => {
        let newValue = item.value;

        const newRotation = Math.round(item.rotateX / itemDegree) * itemDegree;

        if (newRotation > 0) {
          if (
            (newRotation % 360) - 180 >= 0 &&
            (newRotation % 360) - 180 < 360
          ) {
            const k = Math.floor(newRotation / 360) + 1;
            newValue = (item.defaultValue + quantity * k + 60) % 60;
          } else {
            const k = Math.floor(newRotation / 360);
            newValue = (item.defaultValue + quantity * k + 60) % 60;
          }
        } else {
          if (
            (newRotation % 360) + 180 < 0 &&
            (newRotation % 360) + 180 > -360
          ) {
            const k = Math.floor(newRotation / -360) + 1;
            newValue = (item.defaultValue - quantity * k + 60 * k) % 60;
          } else {
            const k = Math.floor(newRotation / -360);
            newValue = (item.defaultValue - quantity * k + 60 * k) % 60;
          }
        }

        return {
          rotateX: newRotation,
          value: newValue,
          defaultValue: item.defaultValue,
        };
      });

      return newItems;
    });

    sumDeltaYScrollMinutesRef.current = 0;
    setIsScrollingMinutes(false);
    setCheckMinutes(true);
  }, [minutes]);

  const postWheelHours = React.useCallback(
    (deltaY: number) => {
      sumDeltaYScrollHoursRef.current =
        sumDeltaYScrollHoursRef.current + deltaY;

      if (timerHoursRef.current) {
        clearTimeout(timerHoursRef.current);
      }

      timerHoursRef.current = setTimeout(() => {
        postMoveHours();
        timerHoursRef.current = null;
      }, postMoveDelay);
    },
    [postMoveHours],
  );

  const postWheelMinutes = React.useCallback(
    (deltaY: number) => {
      sumDeltaYScrollMinutesRef.current =
        sumDeltaYScrollMinutesRef.current + deltaY;

      if (timerMinutesRef.current) {
        clearTimeout(timerMinutesRef.current);
      }

      timerMinutesRef.current = setTimeout(() => {
        postMoveMinutes();
        timerMinutesRef.current = null;
      }, postMoveDelay);
    },
    [postMoveMinutes],
  );

  const updateWheelHours = React.useCallback((deltaY: number) => {
    setItemsHours((s) => {
      const newItems = s.map((item) => {
        const newRotation = item.rotateX + deltaY * koef;
        let newValue = item.value;

        if (newRotation > 0) {
          if (
            (newRotation % 360) - 180 >= 0 &&
            (newRotation % 360) - 180 < 360
          ) {
            const k = Math.floor(newRotation / 360) + 1;
            newValue = (item.defaultValue + quantity * k + 24) % 24;
          } else {
            const k = Math.floor(newRotation / 360);
            newValue = (item.defaultValue + quantity * k + 24) % 24;
          }
        } else {
          if (
            (newRotation % 360) + 180 < 0 &&
            (newRotation % 360) + 180 > -360
          ) {
            const k = Math.floor(newRotation / -360) + 1;
            newValue = (item.defaultValue - quantity * k + 24 * k) % 24;
          } else {
            const k = Math.floor(newRotation / -360);
            newValue = (item.defaultValue - quantity * k + 24 * k) % 24;
          }
        }

        return {
          rotateX: newRotation,
          value: newValue,
          defaultValue: item.defaultValue,
        };
      });

      return newItems;
    });
  }, []);

  const updateWheelMinutes = React.useCallback((deltaY: number) => {
    setItemsMinutes((s) => {
      const newItems = s.map((item) => {
        const newRotation = item.rotateX + deltaY * koef;
        let newValue = item.value;

        if (newRotation > 0) {
          if (
            (newRotation % 360) - 180 >= 0 &&
            (newRotation % 360) - 180 < 360
          ) {
            const k = Math.floor(newRotation / 360) + 1;
            newValue = (item.defaultValue + quantity * k + 60) % 60;
          } else {
            const k = Math.floor(newRotation / 360);
            newValue = (item.defaultValue + quantity * k + 60) % 60;
          }
        } else {
          if (
            (newRotation % 360) + 180 < 0 &&
            (newRotation % 360) + 180 > -360
          ) {
            const k = Math.floor(newRotation / -360) + 1;
            newValue = (item.defaultValue - quantity * k + 60 * k) % 60;
          } else {
            const k = Math.floor(newRotation / -360);
            newValue = (item.defaultValue - quantity * k + 60 * k) % 60;
          }
        }

        return {
          rotateX: newRotation,
          value: newValue,
          defaultValue: item.defaultValue,
        };
      });

      return newItems;
    });
  }, []);

  const handleHoursScroll = React.useCallback(
    (event: React.WheelEvent<HTMLDivElement>) => {
      event.preventDefault();

      let deltaY;

      if (event.deltaY) {
        deltaY = event.deltaY;
      } else {
        deltaY = 0;
      }
      setIsScrollingHours(true);
      updateWheelHours(deltaY);
      postWheelHours(deltaY);
    },
    [postWheelHours, updateWheelHours],
  );

  const handleMinutesScroll = React.useCallback(
    (event: React.WheelEvent<HTMLDivElement>) => {
      event.preventDefault();

      let deltaY;

      if (event.deltaY) {
        deltaY = event.deltaY;
      } else {
        deltaY = 0;
      }
      setIsScrollingMinutes(true);
      updateWheelMinutes(deltaY);
      postWheelMinutes(deltaY);
    },
    [postWheelMinutes, updateWheelMinutes],
  );

  const handleHoursKeyboard = React.useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      event.preventDefault();

      let deltaY;

      if (event.key === "ArrowUp" || event.key === "ArrowDown") {
        deltaY =
          event.key === "ArrowDown" ? deltaYToRollItem : -deltaYToRollItem;

        setIsScrollingHours(true);
        updateWheelHours(deltaY);
        postWheelHours(deltaY);
      }
    },
    [postWheelHours, updateWheelHours],
  );

  const handleMinutesKeyboard = React.useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      event.preventDefault();

      let deltaY;

      if (event.key === "ArrowUp" || event.key === "ArrowDown") {
        deltaY =
          event.key === "ArrowDown" ? deltaYToRollItem : -deltaYToRollItem;

        setIsScrollingMinutes(true);
        updateWheelMinutes(deltaY);
        postWheelMinutes(deltaY);
      }
    },
    [postWheelMinutes, updateWheelMinutes],
  );

  const handleHoursTouchStart = React.useCallback(
    (e: React.TouchEvent<HTMLDivElement>) => {
      setIsTouchingHours(true);

      startTouchYHoursRef.current = e.targetTouches[0].pageY;
      endTouchYHoursRef.current = e.targetTouches[0].pageY;
    },
    [],
  );

  const handleMinutesTouchStart = React.useCallback(
    (e: React.TouchEvent<HTMLDivElement>) => {
      setIsTouchingMinutes(true);

      startTouchYMinutesRef.current = e.targetTouches[0].pageY;
      endTouchYMinutesRef.current = e.targetTouches[0].pageY;
    },
    [],
  );

  const handleHoursTouchMove = React.useCallback(
    (e: React.TouchEvent<HTMLDivElement>) => {
      const deltaY = e.targetTouches[0].pageY - endTouchYHoursRef.current;

      endTouchYHoursRef.current = e.targetTouches[0].pageY;

      setItemsHours((s) => {
        const newItems = s.map((item) => {
          const newRotation = item.rotateX + deltaY * koef * -touchSpeed;
          let newValue = item.value;

          if (newRotation > 0) {
            if (
              (newRotation % 360) - 180 >= 0 &&
              (newRotation % 360) - 180 < 360
            ) {
              const k = Math.floor(newRotation / 360) + 1;
              newValue = (item.defaultValue + quantity * k + 24) % 24;
            } else {
              const k = Math.floor(newRotation / 360);
              newValue = (item.defaultValue + quantity * k + 24) % 24;
            }
          } else {
            if (
              (newRotation % 360) + 180 < 0 &&
              (newRotation % 360) + 180 > -360
            ) {
              const k = Math.floor(newRotation / -360) + 1;
              newValue = (item.defaultValue - quantity * k + 24 * k) % 24;
            } else {
              const k = Math.floor(newRotation / -360);
              newValue = (item.defaultValue - quantity * k + 24 * k) % 24;
            }
          }

          return {
            rotateX: newRotation,
            value: newValue,
            defaultValue: item.defaultValue,
          };
        });

        return newItems;
      });
    },
    [],
  );

  const handleMinutesTouchMove = React.useCallback(
    (e: React.TouchEvent<HTMLDivElement>) => {
      const deltaY = e.targetTouches[0].pageY - endTouchYMinutesRef.current;

      endTouchYMinutesRef.current = e.targetTouches[0].pageY;

      setItemsMinutes((s) => {
        const newItems = s.map((item) => {
          const newRotation = item.rotateX + deltaY * koef * -touchSpeed;
          let newValue = item.value;

          if (newRotation > 0) {
            if (
              (newRotation % 360) - 180 >= 0 &&
              (newRotation % 360) - 180 < 360
            ) {
              const k = Math.floor(newRotation / 360) + 1;
              newValue = (item.defaultValue + quantity * k + 60) % 60;
            } else {
              const k = Math.floor(newRotation / 360);
              newValue = (item.defaultValue + quantity * k + 60) % 60;
            }
          } else {
            if (
              (newRotation % 360) + 180 < 0 &&
              (newRotation % 360) + 180 > -360
            ) {
              const k = Math.floor(newRotation / -360) + 1;
              newValue = (item.defaultValue - quantity * k + 60 * k) % 60;
            } else {
              const k = Math.floor(newRotation / -360);
              newValue = (item.defaultValue - quantity * k + 60 * k) % 60;
            }
          }

          return {
            rotateX: newRotation,
            value: newValue,
            defaultValue: item.defaultValue,
          };
        });

        return newItems;
      });
    },
    [],
  );

  const handleHoursTouchEnd = React.useCallback(() => {
    const params = closestToDivideBy(
      (endTouchYHoursRef.current - startTouchYHoursRef.current) * -touchSpeed,
    );
    let newHour = (hour + params.value) % 24;

    if (newHour < 0) {
      newHour += 24;
    }

    if (newHour > 23) {
      newHour -= 24;
    }

    setHour(newHour);

    setItemsHours((s) => {
      const newItems = s.map((item) => {
        let newValue = item.value;

        const newRotation = Math.round(item.rotateX / itemDegree) * itemDegree;

        if (newRotation > 0) {
          if (
            (newRotation % 360) - 180 >= 0 &&
            (newRotation % 360) - 180 < 360
          ) {
            const k = Math.floor(newRotation / 360) + 1;
            newValue = (item.defaultValue + quantity * k + 24) % 24;
          } else {
            const k = Math.floor(newRotation / 360);
            newValue = (item.defaultValue + quantity * k + 24) % 24;
          }
        } else {
          if (
            (newRotation % 360) + 180 < 0 &&
            (newRotation % 360) + 180 > -360
          ) {
            const k = Math.floor(newRotation / -360) + 1;
            newValue = (item.defaultValue - quantity * k + 24 * k) % 24;
          } else {
            const k = Math.floor(newRotation / -360);
            newValue = (item.defaultValue - quantity * k + 24 * k) % 24;
          }
        }

        return {
          rotateX: newRotation,
          value: newValue,
          defaultValue: item.defaultValue,
        };
      });

      return newItems;
    });

    startTouchYHoursRef.current = 0;
    endTouchYHoursRef.current = 0;
    setIsTouchingHours(false);
    setCheckHours(true);
  }, [hour]);

  const handleMinutesTouchEnd = React.useCallback(() => {
    const params = closestToDivideBy(
      (endTouchYMinutesRef.current - startTouchYMinutesRef.current) *
        -touchSpeed,
    );
    let newMinutes = (minutes + params.value) % 60;

    if (newMinutes < 0) {
      newMinutes += 60;
    }

    if (newMinutes > 59) {
      newMinutes -= 60;
    }

    setMinutes(newMinutes);

    setItemsMinutes((s) => {
      const newItems = s.map((item) => {
        let newValue = item.value;

        const newRotation = Math.round(item.rotateX / itemDegree) * itemDegree;

        if (newRotation > 0) {
          if (
            (newRotation % 360) - 180 >= 0 &&
            (newRotation % 360) - 180 < 360
          ) {
            const k = Math.floor(newRotation / 360) + 1;
            newValue = (item.defaultValue + quantity * k + 60) % 60;
          } else {
            const k = Math.floor(newRotation / 360);
            newValue = (item.defaultValue + quantity * k + 60) % 60;
          }
        } else {
          if (
            (newRotation % 360) + 180 < 0 &&
            (newRotation % 360) + 180 > -360
          ) {
            const k = Math.floor(newRotation / -360) + 1;
            newValue = (item.defaultValue - quantity * k + 60 * k) % 60;
          } else {
            const k = Math.floor(newRotation / -360);
            newValue = (item.defaultValue - quantity * k + 60 * k) % 60;
          }
        }

        return {
          rotateX: newRotation,
          value: newValue,
          defaultValue: item.defaultValue,
        };
      });

      return newItems;
    });

    startTouchYMinutesRef.current = 0;
    endTouchYMinutesRef.current = 0;
    setIsTouchingMinutes(false);
    setCheckMinutes(true);
  }, [minutes]);

  const arrayHours = React.useMemo(
    () =>
      itemsHours.map((item, index) => {
        const handleItemClick = () => {
          if (isScrollingHours || isTouchingHours) {
            return;
          }

          const currentValue = item.value;
          setHour(currentValue);

          const currentRotation = item.rotateX;

          if (currentRotation % 360 === 0) {
            return;
          }

          let difference = (0 - (currentRotation % 360)) % 360;

          if (difference < -180) {
            difference = (360 - (currentRotation % 360)) % 360;
          }

          if (difference > 180) {
            difference = ((360 - difference) * -1) % 360;
          }

          setItemsHours((s) => {
            const newItems = s.map((item) => {
              const newRotation = item.rotateX + difference;
              let newValue = item.value;

              if (newRotation > 0) {
                if (
                  (newRotation % 360) - 180 >= 0 &&
                  (newRotation % 360) - 180 < 360
                ) {
                  const k = Math.floor(newRotation / 360) + 1;
                  newValue = (item.defaultValue + quantity * k + 24) % 24;
                } else {
                  const k = Math.floor(newRotation / 360);
                  newValue = (item.defaultValue + quantity * k + 24) % 24;
                }
              } else {
                if (
                  (newRotation % 360) + 180 < 0 &&
                  (newRotation % 360) + 180 > -360
                ) {
                  const k = Math.floor(newRotation / -360) + 1;
                  newValue = (item.defaultValue - quantity * k + 24 * k) % 24;
                } else {
                  const k = Math.floor(newRotation / -360);
                  newValue = (item.defaultValue - quantity * k + 24 * k) % 24;
                }
              }

              return {
                rotateX: newRotation,
                value: newValue,
                defaultValue: item.defaultValue,
              };
            });

            return newItems;
          });
        };

        const className = `timepicker__scroller__wheel__item ${
          Math.round((item.rotateX % 360) / itemDegree) * itemDegree !== 0 &&
          !isScrollingHours &&
          !isTouchingHours
            ? "timepicker__scroller__wheel__item-canHover"
            : ""
        } ${(Math.round(item.rotateX / itemDegree) * itemDegree) % 360 === 0 ? "timepicker__scroller__wheel__item-selected" : ""}`;

        return (
          <div
            key={index}
            aria-hidden="true"
            className={className}
            style={{
              transform: `rotateX(${item.rotateX}deg) translateZ(85px)`,
            }}
            onClick={handleItemClick}
          >
            {item.value.toString().padStart(2, "0")}
          </div>
        );
      }),
    [isScrollingHours, isTouchingHours, itemsHours],
  );

  const arrayMinutes = React.useMemo(
    () =>
      itemsMinutes.map((item, index) => {
        const handleItemClick = () => {
          if (isScrollingMinutes || isTouchingMinutes) {
            return;
          }

          const currentValue = item.value;
          setMinutes(currentValue);

          const currentRotation = item.rotateX;

          if (currentRotation % 360 === 0) {
            return;
          }

          let difference = (0 - (currentRotation % 360)) % 360;

          if (difference < -180) {
            difference = (360 - (currentRotation % 360)) % 360;
          }

          if (difference > 180) {
            difference = ((360 - difference) * -1) % 360;
          }

          setItemsMinutes((s) => {
            const newItems = s.map((item) => {
              const newRotation = item.rotateX + difference;
              let newValue = item.value;

              if (newRotation > 0) {
                if (
                  (newRotation % 360) - 180 >= 0 &&
                  (newRotation % 360) - 180 < 360
                ) {
                  const k = Math.floor(newRotation / 360) + 1;
                  newValue = (item.defaultValue + quantity * k + 60) % 60;
                } else {
                  const k = Math.floor(newRotation / 360);
                  newValue = (item.defaultValue + quantity * k + 60) % 60;
                }
              } else {
                if (
                  (newRotation % 360) + 180 < 0 &&
                  (newRotation % 360) + 180 > -360
                ) {
                  const k = Math.floor(newRotation / -360) + 1;
                  newValue = (item.defaultValue - quantity * k + 60 * k) % 60;
                } else {
                  const k = Math.floor(newRotation / -360);
                  newValue = (item.defaultValue - quantity * k + 60 * k) % 60;
                }
              }

              return {
                rotateX: newRotation,
                value: newValue,
                defaultValue: item.defaultValue,
              };
            });

            return newItems;
          });
        };

        const className = `timepicker__scroller__wheel__item ${
          Math.round((item.rotateX % 360) / itemDegree) * itemDegree !== 0 &&
          !isScrollingMinutes &&
          !isTouchingMinutes
            ? "timepicker__scroller__wheel__item-canHover"
            : ""
        } ${(Math.round(item.rotateX / itemDegree) * itemDegree) % 360 === 0 ? "timepicker__scroller__wheel__item-selected" : ""}`;

        return (
          <div
            key={index}
            aria-hidden="true"
            className={className}
            style={{
              transform: `rotateX(${item.rotateX}deg) translateZ(85px)`,
            }}
            onClick={handleItemClick}
          >
            {item.value.toString().padStart(2, "0")}
          </div>
        );
      }),
    [isScrollingMinutes, isTouchingMinutes, itemsMinutes],
  );

  const prevMonth = React.useCallback(() => {
    setCurrentDate(
      (prevDate) =>
        new Date(prevDate.getFullYear(), prevDate.getMonth() - 1, 1),
    );
  }, []);

  const nextMonth = React.useCallback(() => {
    setCurrentDate(
      (prevDate) =>
        new Date(prevDate.getFullYear(), prevDate.getMonth() + 1, 1),
    );
  }, []);

  const prevYear = React.useCallback(() => {
    setCurrentDate(
      (prevDate) =>
        new Date(prevDate.getFullYear() - 1, prevDate.getMonth(), 1),
    );
  }, []);

  const nextYear = React.useCallback(() => {
    setCurrentDate(
      (prevDate) =>
        new Date(prevDate.getFullYear() + 1, prevDate.getMonth(), 1),
    );
  }, []);

  const prevYearRange = React.useCallback(() => {
    setStartYear(startYear - 12);
    setEndYear(endYear - 12);
  }, [endYear, startYear]);

  const nextYearRange = React.useCallback(() => {
    setStartYear(startYear + 12);
    setEndYear(endYear + 12);
  }, [endYear, startYear]);

  const selectMonth = React.useCallback((month: Date) => {
    setCurrentDate(month);
    setIsSelectingMonth(false);
    setIsSelectingYear(false);
  }, []);

  const selectDay = React.useCallback(
    (date: Date) => {
      const newHour = hour;
      const newMinutes = minutes;

      if (timerHoursRef.current) {
        clearTimeout(timerHoursRef.current);
        timerHoursRef.current = null;
      }

      if (
        sumDeltaYScrollHoursRef.current != 0 ||
        endTouchYHoursRef.current != 0 ||
        startTouchYHoursRef.current != 0
      ) {
        sumDeltaYScrollHoursRef.current = 0;
        endTouchYHoursRef.current = 0;
        startTouchYHoursRef.current = 0;
        updateWheelItems(newHour, 24, setItemsHours);
      }

      if (timerMinutesRef.current) {
        clearTimeout(timerMinutesRef.current);
        timerMinutesRef.current = null;
      }

      if (
        sumDeltaYScrollMinutesRef.current != 0 ||
        endTouchYMinutesRef.current != 0 ||
        startTouchYMinutesRef.current != 0
      ) {
        sumDeltaYScrollMinutesRef.current = 0;
        endTouchYMinutesRef.current = 0;
        startTouchYMinutesRef.current = 0;
        updateWheelItems(newMinutes, 60, setItemsMinutes);
      }

      const newDate = new Date(date);
      newDate.setHours(newHour, newMinutes);
      setSelectedDate(newDate);
      setHour(newHour);
      setMinutes(newMinutes);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      hour,
      minutes,
      setSelectedDate,
      sumDeltaYScrollHoursRef.current,
      endTouchYHoursRef.current,
      startTouchYHoursRef.current,
      sumDeltaYScrollMinutesRef.current,
      endTouchYMinutesRef.current,
      startTouchYMinutesRef.current,
    ],
  );

  const renderDays = () => {
    const days = [];
    const firstDayOfMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      2,
    ).getDay();

    const totalDays = daysInMonth(currentDate);

    const prevMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() - 1,
      1,
    );
    const nextMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + 1,
      1,
    );

    const prevMonthDays = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;
    const nextMonthDays = 42 - totalDays - prevMonthDays;

    const selectedStartDateWithoutTime = selectedDate
      ? new Date(
          selectedDate.getFullYear(),
          selectedDate.getMonth(),
          selectedDate.getDate(),
        )
      : new Date();

    // Дни предыдущего месяца
    for (let i = prevMonthDays; i > 0; i--) {
      const prevMonthDate = new Date(
        prevMonth.getFullYear(),
        prevMonth.getMonth(),
        daysInMonth(prevMonth) - i + 1,
      );

      const isSelected =
        selectedDate &&
        selectedStartDateWithoutTime.toDateString() ===
          prevMonthDate.toDateString();

      days.push(
        <div
          key={`prev-month-day-${i}`}
          onClick={() => selectDay(prevMonthDate)}
          className="calendar__grid__cell"
        >
          <div
            className={`calendar__day calendar__day-prevMonth ${
              isSelected ? "calendar__day-selected" : ""
            }`}
          >
            {prevMonthDate.getDate()}
          </div>
        </div>,
      );
    }

    // Дни текущего месяца
    for (let i = 1; i <= totalDays; i++) {
      const date = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        i,
      );
      const isSelected =
        selectedDate &&
        selectedStartDateWithoutTime.toDateString() === date.toDateString();

      days.push(
        <div
          key={`calendar__day-${i}`}
          onClick={() => selectDay(date)}
          className="calendar__grid__cell"
        >
          <div
            className={`calendar__day ${
              isSelected ? "calendar__day-selected" : ""
            }`}
          >
            {i}
          </div>
        </div>,
      );
    }

    // Дни следующего месяца
    for (let i = 1; i <= nextMonthDays; i++) {
      const nextMonthDate = new Date(
        nextMonth.getFullYear(),
        nextMonth.getMonth(),
        i,
      );

      const isSelected =
        selectedDate &&
        selectedStartDateWithoutTime.toDateString() ===
          nextMonthDate.toDateString();

      days.push(
        <div
          key={`next-month-day-${i}`}
          onClick={() => selectDay(nextMonthDate)}
          className="calendar__grid__cell"
        >
          <div
            className={`calendar__day calendar__day-nextMonth ${
              isSelected ? "calendar__day-selected" : ""
            }`}
          >
            {nextMonthDate.getDate()}
          </div>
        </div>,
      );
    }

    return days;
  };

  const renderMonths = () =>
    months.map((month, index) => {
      const isSelected =
        month.getMonth() === currentDate.getMonth() &&
        month.getFullYear() === currentDate.getFullYear();

      return (
        <div
          key={`calendar__month-${index}`}
          className={`calendar__month ${
            isSelected ? "calendar__month-selected" : ""
          }`}
          onClick={() => selectMonth(month)}
        >
          {month.toLocaleString("en-US", { month: "long" }).slice(0, 3)}
        </div>
      );
    });

  const renderYears = () => {
    const years = [];

    for (let i = startYear; i <= endYear; i++) {
      years.push(
        <div
          key={`calendar__year-${i}`}
          className={`calendar__year ${
            currentDate.getFullYear() === i ? "calendar__year-selected" : ""
          }`}
          onClick={() => {
            setCurrentDate(new Date(i, currentDate.getMonth(), 1));
            setIsSelectingMonth(true);
            setIsSelectingYear(false);
          }}
        >
          {i}
        </div>,
      );
    }

    return years;
  };

  const headerDays = (
    <div className="calendar__header">
      <span
        className="calendar__header__text"
        onClick={() => {
          setIsSelectingYear(false);
          setIsSelectingMonth(true);
        }}
      >
        {currentDate.toLocaleString("en-US", { month: "long" })}{" "}
        {currentDate.getFullYear()}
      </span>

      <div className="calendar__header__arrows">
        <ArrowLeft onClick={prevMonth} className="calendar__header__arrow" />

        <ArrowRight onClick={nextMonth} className="calendar__header__arrow" />
      </div>
    </div>
  );

  const headerMonth = (
    <div className="calendar__header">
      <span
        className="calendar__header__text"
        onClick={() => {
          setIsSelectingYear(true);
          setIsSelectingMonth(false);
        }}
      >
        {currentDate.getFullYear()}
      </span>

      <div className="calendar__header__arrows">
        <ArrowLeft onClick={prevYear} className="calendar__header__arrow" />

        <ArrowRight onClick={nextYear} className="calendar__header__arrow" />
      </div>
    </div>
  );

  const headerYear = (
    <div className="calendar__header">
      <span
        className="calendar__header__text"
        onClick={() => {
          setIsSelectingYear(false);
          setIsSelectingMonth(false);
        }}
      >
        {startYear}-{endYear}
      </span>

      <div className="calendar__header__arrows">
        <ArrowLeft
          onClick={prevYearRange}
          className="calendar__header__arrow"
        />

        <ArrowRight
          onClick={nextYearRange}
          className="calendar__header__arrow"
        />
      </div>
    </div>
  );

  const gridDays = (
    <div className="calendar__grid">
      <div className="calendar__day calendar__day-title">S</div>
      <div className="calendar__day calendar__day-title">M</div>
      <div className="calendar__day calendar__day-title">T</div>
      <div className="calendar__day calendar__day-title">W</div>
      <div className="calendar__day calendar__day-title">T</div>
      <div className="calendar__day calendar__day-title">F</div>
      <div className="calendar__day calendar__day-title">S</div>
      {renderDays()}
    </div>
  );

  const gridMonths = (
    <div className="calendar__grid calendar__grid-months">{renderMonths()}</div>
  );

  const gridYears = (
    <div className="calendar__grid calendar__grid-years">{renderYears()}</div>
  );

  //сбрасываем диапазон годов когда выбирается месяц/день
  React.useLayoutEffect(() => {
    if (!isSelectingYear) {
      setStartYear(getRangeStartYear(currentDate.getFullYear()));
      setEndYear(getRangeEndYear(currentDate.getFullYear()));
    }
  }, [currentDate, isSelectingYear]);

  //устанавливаем состояние для таймпикера при рендере, если даты не выбраны - тогда все по нулям
  React.useLayoutEffect(() => {
    if (selectedDate) {
      const valueHour = getHours(selectedDate);
      const valueMinutes = getMinutes(selectedDate);

      updateWheelItems(valueHour, 24, setItemsHours);
      updateWheelItems(valueMinutes, 60, setItemsMinutes);

      if (valueHour !== null) {
        setHour(valueHour);
      }

      if (valueMinutes !== null) {
        setMinutes(valueMinutes);
      }
    }

    setIsReady(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  //очистка таймера при размаунте
  React.useEffect(() => {
    return () => {
      if (timerHoursRef.current) {
        clearTimeout(timerHoursRef.current);
        timerHoursRef.current = null;
      }
      if (timerMinutesRef.current) {
        clearTimeout(timerMinutesRef.current);
        timerMinutesRef.current = null;
      }
    };
  }, []);

  //установка даты/времени selectedStartDate
  React.useEffect(() => {
    if (!isReady) {
      return;
    }

    const needUpdateDate =
      selectedDate &&
      (selectedDate.getHours() !== hour ||
        selectedDate.getMinutes() !== minutes);

    if (needUpdateDate) {
      const newMinutes = minutes;

      const newDate = new Date(selectedDate);
      newDate.setHours(hour, newMinutes);
      setSelectedDate(newDate);

      setMinutes(newMinutes);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hour, minutes, selectedDate, setSelectedDate]);

  //проверка колеса часов
  React.useEffect(() => {
    if (checkHours && !isScrollingHours && !isTouchingHours) {
      setItemsHours((s) => {
        const parentIndex = s.findIndex((item) => item.rotateX % 360 === 0);

        if (parentIndex < 0) {
          console.log("проверка колеса часов parentIndex failed");
          return s;
        } else {
          console.log("проверка колеса часов parentIndex ok");
        }

        const parentRotateX = s[parentIndex].rotateX;

        const newItems = s.map((item, index) => {
          let newRotation = item.rotateX;

          if (index < parentIndex) {
            const k = parentIndex - index;
            newRotation = parentRotateX + k * itemDegree;
          } else if (index > parentIndex) {
            const k = index - parentIndex;
            newRotation = parentRotateX - k * itemDegree;
          }

          return {
            rotateX: newRotation,
            value: item.value,
            defaultValue: item.defaultValue,
          };
        });

        return newItems;
      });

      setCheckHours(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [checkHours, isScrollingHours, isTouchingHours]);

  //проверка колеса минут
  React.useEffect(() => {
    if (checkMinutes && !isScrollingMinutes && !isTouchingMinutes) {
      setItemsMinutes((s) => {
        const parentIndex = s.findIndex((item) => item.rotateX % 360 === 0);

        if (parentIndex < 0) {
          console.log("проверка колеса минут parentIndex failed");
          return s;
        } else {
          console.log("проверка колеса минут parentIndex ok");
        }

        const parentRotateX = s[parentIndex].rotateX;

        const newItems = s.map((item, index) => {
          let newRotation = item.rotateX;

          if (index < parentIndex) {
            const k = parentIndex - index;
            newRotation = parentRotateX + k * itemDegree;
          } else if (index > parentIndex) {
            const k = index - parentIndex;
            newRotation = parentRotateX - k * itemDegree;
          }

          return {
            rotateX: newRotation,
            value: item.value,
            defaultValue: item.defaultValue,
          };
        });

        return newItems;
      });

      setCheckMinutes(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [checkMinutes, isScrollingMinutes, isTouchingMinutes]);

  return (
    <>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          margin: "auto",
        }}
      >
        <div className="calendar">
          {isSelectingYear
            ? headerYear
            : isSelectingMonth
              ? headerMonth
              : headerDays}

          {isSelectingYear
            ? gridYears
            : isSelectingMonth
              ? gridMonths
              : gridDays}
        </div>

        <div>
          <TimePicker
            arrayHours={arrayHours}
            arrayMinutes={arrayMinutes}
            handleHoursScroll={handleHoursScroll}
            handleMinutesScroll={handleMinutesScroll}
            handleHoursKeyboard={handleHoursKeyboard}
            handleMinutesKeyboard={handleMinutesKeyboard}
            handleHoursTouchStart={handleHoursTouchStart}
            handleMinutesTouchStart={handleMinutesTouchStart}
            handleHoursTouchMove={handleHoursTouchMove}
            handleMinutesTouchMove={handleMinutesTouchMove}
            handleHoursTouchEnd={handleHoursTouchEnd}
            handleMinutesTouchEnd={handleMinutesTouchEnd}
          />
        </div>
      </div>
    </>
  );
};

export default React.memo(Calendar);
