import { useStore } from "hooks/useStore";
import { observer } from "mobx-react-lite";
import Auth from "pages/Auth";
import ErrorPage from "pages/ErrorPage";
import Home from "pages/Home";
import { useState } from "react";
import { RouterProvider, createBrowserRouter } from "react-router-dom";

const Router = () => {
  const { userStore } = useStore();

  const [isLoading] = useState(true);

  if (isLoading) {
    return <h1>Loading...</h1>;
  }

  const router = createBrowserRouter(
    [
      {
        path: "/",
        element: userStore.isAuth ? <Home /> : <Auth />,
        errorElement: <ErrorPage />,
      },
      // Добавьте другие маршруты с защитой аутентификации здесь
    ],
    { basename: "/gateway/tasks" },
  );

  return <RouterProvider router={router} />;
};

export default observer(Router);