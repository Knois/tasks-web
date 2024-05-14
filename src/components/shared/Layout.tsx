// components/Layout.js

import { memo } from "react";
import { Outlet } from "react-router-dom";

import Header from "./Header";

const Layout = () => (
  <div>
    <Header />
    <main>
      <Outlet />
    </main>
  </div>
);

export default memo(Layout);
