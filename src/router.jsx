import { createBrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import HomePage from "./pages/HomePage.jsx";
import CreatePage from "./pages/CreatePage.jsx";
import DetailPage from "./pages/DetailPage.jsx";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    id: "root",
    errorElement: <div>Page not found</div>,
    children: [
      {
        path: "/",
        element: <HomePage />,
      },
      {
        path: "/create",
        element: <CreatePage />,
      },
      {
        path: "/movie/:id",
        element: <DetailPage />,
      },
    ],
  },
]);
