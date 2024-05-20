// components/Layout.js

import Header from "components/shared/Header";
import { memo } from "react";
import { Outlet } from "react-router-dom";

const Layout = () => (
  <>
    <Header />

    <Outlet />
  </>
);

export default memo(Layout);
