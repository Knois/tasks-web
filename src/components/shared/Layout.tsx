import Header from "components/shared/Header";
import { memo } from "react";
import { Outlet } from "react-router-dom";

const Layout = () => {
  return (
    <>
      <Header />

      <main className="main">
        <Outlet />
      </main>
    </>
  );
};

export default memo(Layout);
