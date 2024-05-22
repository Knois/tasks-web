// components/Layout.js

import Header from "components/shared/Header";
import Sidebar from "components/shared/Sidebar";
import { memo, useState } from "react";
import { Outlet } from "react-router-dom";

const Layout = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <>
      <Header />
      <Sidebar isExpanded={isExpanded} setIsExpanded={setIsExpanded} />

      <main className={`main ${isExpanded ? "main-wide" : ""}`}>
        <Outlet />
      </main>
    </>
  );
};

export default memo(Layout);
