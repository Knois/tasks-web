import Board from "components/shared/Board";
import Sidebar from "components/shared/Sidebar";
import { memo } from "react";

const Dashboard = () => {
  return (
    <main>
      <Sidebar />
      <Board />
    </main>
  );
};

export default memo(Dashboard);
