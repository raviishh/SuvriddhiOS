import React from "react";
import ReactDOM from "react-dom/client";
import { createHashRouter, RouterProvider } from "react-router";
import "./styles/index.css";
import "./styles/fonts.css";

import Home from "./pages/Home";
import Learn from "./pages/Learn";
import DatasheetSelector from "./pages/Data";
import PeriodicTable from "./components/data_table/Chem";
import PhyTables from "./components/data_table/Phy";
import MathTables from "./components/data_table/Math";
import SubjectSelector from "./pages/Study";
import Settings from "./pages/Settings";
import Notes from "./components/study_zone/Notes";
import FlashcardApp from "./components/study_zone/Flashcard";
import LearnPage from "./components/study_zone/pdf_thing";
import WiFi from "./components/settings/wifi";

const router = createHashRouter([
    { path: "/", element: <Home /> },
    { path: "/learn", element: <Learn /> },
    { path: "/data", element: <DatasheetSelector /> },
    { path: "/data/chem", element: <PeriodicTable /> },
    { path: "/data/physics", element: <PhyTables /> },
    { path: "/data/math", element: <MathTables /> },
    { path: "/notes", element: <SubjectSelector /> },
    { path: "/settings", element: <Settings /> },
    { path: "/study/notes", element: <Notes /> },
    { path: "/study/flashcards", element: <FlashcardApp /> },
    { path: "/study/books", element: <LearnPage /> },
    { path: "settings/wifi", element: <WiFi />},
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
        <RouterProvider router={router} />
    </React.StrictMode>,
);
