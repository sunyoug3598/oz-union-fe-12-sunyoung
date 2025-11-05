import React from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { router } from "./app/router";
import "./app/styles/tailwind.css";
import "./app/styles/globals.css";
import { EventsProvider } from "./app/store/eventsContext";

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <EventsProvider>
      <RouterProvider router={router} />
    </EventsProvider>
  </React.StrictMode>
);