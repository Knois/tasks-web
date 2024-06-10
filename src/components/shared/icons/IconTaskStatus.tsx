import { ReactComponent as Created } from "assets/svg/created.svg";
import { ReactComponent as Done } from "assets/svg/done.svg";
import { ReactComponent as Progress } from "assets/svg/progress.svg";
import { ReactComponent as Rejected } from "assets/svg/rejected.svg";
import React from "react";
import { ITask, Status } from "types/Task";

type IconStatusProps = {
  status: ITask["status"];
};

const IconTaskStatus: React.FC<IconStatusProps> = ({ status }) => {
  switch (status) {
    case Status.CREATED:
      return <Created />;
    case Status.IN_PROGRESS:
      return <Progress />;
    case Status.DONE:
      return <Done />;
    case Status.REJECTED:
      return <Rejected />;
    default:
      return <></>;
  }
};

export default React.memo(IconTaskStatus);
