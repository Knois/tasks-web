// components/Layout.js

import { memo } from "react";
import { Outlet } from "react-router-dom";

import Header from "./Header";

const Layout = () => (
  <>
    <Header />
    <main>
      <Outlet />
    </main>
  </>
);

export default memo(Layout);
