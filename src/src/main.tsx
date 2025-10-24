import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router";
import "./styles/index.css";
import "./styles/fonts.css";


import Home from "./pages/Home";
import Learn from "./pages/Learn";
import Train from "./pages/Train";
import Sandbox from "./pages/Sandbox";
import Settings from "./pages/Settings";

const router = createBrowserRouter([
  { path: "/", element: <Home /> },
  { path: "/learn", element: <Learn /> },
  { path: "/train", element: <Train /> },
  { path: "/sandbox", element: <Sandbox /> },
  { path: "/settings", element: <Settings /> },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
