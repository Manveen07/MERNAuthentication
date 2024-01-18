import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import PageNotFound from "./components/PageNotFound";
import Password from "./components/Password";
import Profile from "./components/Profile";
import Register from "./components/Register";
import Recover from "./components/Recover";
import Reset from "./components/Reset";
import Username from "./components/Username";
import { Authorize, ProtectedRoute } from "./middleware/auth";
const router = createBrowserRouter([
  {
    path: "/",
    element: <Username />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/password",
    element: (
      <ProtectedRoute>
        <Password />
      </ProtectedRoute>
    ),
  },
  {
    path: "/profile",
    element: (
      <Authorize>
        <Profile />
      </Authorize>
    ),
  },
  {
    path: "/recover",
    element: <Recover />,
  },
  {
    path: "/reset",
    element: <Reset />,
  },
  {
    path: "*",
    element: <PageNotFound />,
  },
]);
const App = () => {
  return (
    <main>
      <RouterProvider router={router}></RouterProvider>{" "}
    </main>
  );
};

export default App;
