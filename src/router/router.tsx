import Layout from "components/shared/Layout";
import Loading from "components/shared/Loading";
import { useStore } from "hooks/useStore";
import { observer } from "mobx-react-lite";
import Auth from "pages/Auth";
import CreateGroup from "pages/CreateGroup";
import CreateSpace from "pages/CreateSpace";
import Dashboard from "pages/Dashboard";
import EditGroup from "pages/EditGroup";
import EditSpace from "pages/EditSpace";
import ErrorPage from "pages/ErrorPage";
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
        { path: "/", element: <Dashboard /> },
        { path: "create-space", element: <CreateSpace /> },
        {
          path: ":spaceId",
          element: <Dashboard />,
        },
        { path: ":spaceId/edit-space", element: <EditSpace /> },
        { path: ":spaceId/create-group", element: <CreateGroup /> },
        { path: ":spaceId/:groupId", element: <Dashboard /> },
        { path: ":spaceId/:groupId/edit-group", element: <EditGroup /> },
        { path: ":spaceId/:groupId/create-task", element: <Dashboard /> },
        { path: ":spaceId/:groupId/:taskId", element: <Dashboard /> },
        { path: ":spaceId/:groupId/:taskId/edit-task", element: <Dashboard /> },
      ],
    },
  ];

  const options = { basename: "/gateway/tasks" };

  const router = createBrowserRouter(routes, options);

  return <RouterProvider router={router} />;
};

export default observer(Router);
