import Layout from "components/shared/Layout";
import Loading from "components/shared/Loading";
import { useStore } from "hooks/useStore";
import { observer } from "mobx-react-lite";
import Auth from "pages/Auth";
import CreateSpace from "pages/CreateSpace";
import ErrorPage from "pages/ErrorPage";
import Home from "pages/Home";
import Space from "pages/Space";
import { useEffect, useState } from "react";
import { RouterProvider, createBrowserRouter } from "react-router-dom";

const Router = () => {
  const { userStore } = useStore();
  const [isLoading, setIsLoading] = useState(true);

  //сначала проверяем токен
  useEffect(() => {
    const checkAuth = async () => {
      await userStore.getUser();
      setIsLoading(false);
    };

    checkAuth();
  }, [userStore]);

  if (isLoading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <Loading />
      </div>
    );
  }

  if (!userStore.isAuth) {
    return <Auth />;
  }

  const routes = [
    {
      path: "/",
      element: <Layout />,
      errorElement: <ErrorPage />,
      children: [
        { path: "/", element: <Home /> },
        { path: "create-space", element: <CreateSpace /> },
        { path: "space/:spaceId", element: <Space /> },
      ],
    },
  ];

  const router = createBrowserRouter(routes, { basename: "/gateway/tasks" });

  return <RouterProvider router={router} />;
};

export default observer(Router);
