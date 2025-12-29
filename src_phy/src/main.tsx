import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router";
import "./styles/index.css";
import "./styles/fonts.css";


import Home from "./pages/Home";
import Learn from "./pages/Learn";
import Achievements from "./pages/Achievements";
import Notes from "./pages/Notes";
import Settings from "./pages/Settings";

const router = createBrowserRouter([
  { path: "/", element: <Home /> },
  { path: "/learn", element: <Learn /> },
  { path: "/achievements", element: <Achievements /> },
  { path: "/notes", element: <Notes /> },
  { path: "/settings", element: <Settings /> },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
