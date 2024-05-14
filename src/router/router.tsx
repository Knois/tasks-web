import Layout from "components/shared/Layout";
import Loading from "components/shared/Loading";
import { useStore } from "hooks/useStore";
import { observer } from "mobx-react-lite";
import Auth from "pages/Auth";
import CreateSpace from "pages/CreateSpace";
import EditSpace from "pages/EditSpace";
import ErrorPage from "pages/ErrorPage";
import Home from "pages/Home";
import Space from "pages/Space";
import { useLayoutEffect, useState } from "react";
import { RouterProvider, createBrowserRouter } from "react-router-dom";

const Router = () => {
  const { userStore } = useStore();
  const [isLoading, setIsLoading] = useState(true);

  //сначала проверяем токен
  useLayoutEffect(() => {
    const checkAuth = async () => {
      await userStore.getUser();
      setIsLoading(false);
    };

    checkAuth();
  }, [userStore]);

  if (isLoading) {
    return (
      <div className="screenbox">
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
        {
          path: "space/:spaceId",
          element: <Space />,
        },
        { path: "space/:spaceId/edit-space", element: <EditSpace /> },
      ],
    },
  ];

  const router = createBrowserRouter(routes, { basename: "/gateway/tasks" });

  return <RouterProvider router={router} />;
};

export default observer(Router);
