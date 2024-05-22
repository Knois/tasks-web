// components/Layout.js

import Header from "components/shared/Header";
import Sidebar from "components/shared/Sidebar";
import { useStore } from "hooks/useStore";
import { observer } from "mobx-react-lite";
import { Outlet } from "react-router-dom";

const Layout = () => {
  const { appStore } = useStore();

  const className = `main ${appStore.isExpandedSidebar ? "main-wide" : ""}`;

  return (
    <>
      <Header />
      <Sidebar />

      <main className={className}>
        <Outlet />
      </main>
    </>
  );
};

export default observer(Layout);
