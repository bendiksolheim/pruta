import React from "react";
import { Container } from "./container";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Containers } from "./containers";
import { Images } from "./images";
import { Root } from "./Root";
import "./app.css";
import { Networks } from "./networks";

const routes = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    children: [
      {
        path: "/",
        element: <Containers />,
      },
      {
        path: "/container/:id",
        element: <Container />,
      },
      {
        path: "/images",
        element: <Images />,
      },
      {
        path: "/networks",
        element: <Networks />,
      },
    ],
  },
]);

function App() {
  return (
    <React.StrictMode>
      <RouterProvider router={routes} />
    </React.StrictMode>
  );
}

export default App;
