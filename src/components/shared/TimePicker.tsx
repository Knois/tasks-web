import React from "react";

type TimePickerProps = {
  arrayHours: JSX.Element[];
  arrayMinutes: JSX.Element[];
  handleHoursScroll: (event: React.WheelEvent<HTMLDivElement>) => void;
  handleMinutesScroll: (event: React.WheelEvent<HTMLDivElement>) => void;
  handleHoursKeyboard: (event: React.KeyboardEvent<HTMLDivElement>) => void;
  handleMinutesKeyboard: (event: React.KeyboardEvent<HTMLDivElement>) => void;
  handleHoursTouchStart: (e: React.TouchEvent<HTMLDivElement>) => void;
  handleMinutesTouchStart: (e: React.TouchEvent<HTMLDivElement>) => void;
  handleHoursTouchMove: (e: React.TouchEvent<HTMLDivElement>) => void;
  handleMinutesTouchMove: (e: React.TouchEvent<HTMLDivElement>) => void;
  handleHoursTouchEnd: () => void;
  handleMinutesTouchEnd: () => void;
};

const TimePicker: React.FC<TimePickerProps> = ({
  arrayHours,
  arrayMinutes,
  handleHoursScroll,
  handleMinutesScroll,
  handleHoursKeyboard,
  handleMinutesKeyboard,
  handleHoursTouchStart,
  handleMinutesTouchStart,
  handleHoursTouchMove,
  handleMinutesTouchMove,
  handleHoursTouchEnd,
  handleMinutesTouchEnd,
}) => {
  const scrollerHoursRef = React.useRef<HTMLDivElement>(null);
  const scrollerMinutesRef = React.useRef<HTMLDivElement>(null);

  //часы listeners
  React.useLayoutEffect(() => {
    const scrollerElement = scrollerHoursRef.current;

    if (scrollerElement) {
      const handleWheel = (event: WheelEvent) => {
        handleHoursScroll(event as unknown as React.WheelEvent<HTMLDivElement>);
      };

      const handleKeyboard = (event: KeyboardEvent) => {
        handleHoursKeyboard(
          event as unknown as React.KeyboardEvent<HTMLDivElement>,
        );
      };

      scrollerElement.addEventListener("wheel", handleWheel, {
        passive: false,
      });

      scrollerElement.addEventListener("keydown", handleKeyboard, {
        passive: false,
      });

      return () => {
        scrollerElement.removeEventListener("wheel", handleWheel);
        scrollerElement.removeEventListener("keydown", handleKeyboard);
      };
    }
  }, [handleHoursKeyboard, handleHoursScroll, scrollerHoursRef]);

  //минуты listeners
  React.useLayoutEffect(() => {
    const scrollerElement = scrollerMinutesRef.current;

    if (scrollerElement) {
      const handleWheel = (event: WheelEvent) => {
        handleMinutesScroll(
          event as unknown as React.WheelEvent<HTMLDivElement>,
        );
      };

      const handleKeyboard = (event: KeyboardEvent) => {
        handleMinutesKeyboard(
          event as unknown as React.KeyboardEvent<HTMLDivElement>,
        );
      };

      scrollerElement.addEventListener("wheel", handleWheel, {
        passive: false,
      });
      scrollerElement.addEventListener("keydown", handleKeyboard, {
        passive: false,
      });

      return () => {
        scrollerElement.removeEventListener("wheel", handleWheel);
        scrollerElement.removeEventListener("keydown", handleKeyboard);
      };
    }
  }, [handleMinutesKeyboard, handleMinutesScroll, scrollerMinutesRef]);

  return (
    <div className="timepicker">
      <div className="timepicker__scroller">
        <div className="timepicker__scroller__wheel">
          <div className="timepicker__scroller__wheel__line" />
          <div className="timepicker__scroller__wheel__group">
            <div className="timepicker__scroller__wheel__overlay" />

            {/* Часы */}
            <div className="timepicker__scroller__wheel__options">
              <div className="timepicker__scroller__wheel__3d">
                <div
                  className="timepicker__scroller__wheel__items"
                  tabIndex={-1}
                  ref={scrollerHoursRef}
                  onTouchStart={handleHoursTouchStart}
                  onTouchMove={handleHoursTouchMove}
                  onTouchEnd={handleHoursTouchEnd}
                >
                  {arrayHours}
                </div>
              </div>
            </div>

            {/* Минуты */}
            <div className="timepicker__scroller__wheel__options">
              <div className="timepicker__scroller__wheel__3d">
                <div
                  className="timepicker__scroller__wheel__items"
                  tabIndex={-1}
                  ref={scrollerMinutesRef}
                  onTouchStart={handleMinutesTouchStart}
                  onTouchMove={handleMinutesTouchMove}
                  onTouchEnd={handleMinutesTouchEnd}
                >
                  {arrayMinutes}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(TimePicker);
