import { ReactComponent as High } from "assets/svg/high.svg";
import { ReactComponent as Low } from "assets/svg/low.svg";
import { ReactComponent as Medium } from "assets/svg/medium.svg";
import React from "react";
import { ITask, Level } from "types/Task";

type IconTaskLevelProps = {
  level: ITask["hardLvl"] | ITask["priority"];
};

const IconTaskLevel: React.FC<IconTaskLevelProps> = ({ level }) => {
  switch (level) {
    case Level.HIGH:
      return <High />;
    case Level.MEDIUM:
      return <Medium />;
    case Level.LOW:
      return <Low />;
    default:
      return <></>;
  }
};

export default React.memo(IconTaskLevel);
