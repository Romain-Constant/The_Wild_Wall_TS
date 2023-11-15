// Import necessary libraries and components
import React from "react";
import ReactDOM from "react-dom/client";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import {AuthProvider} from "./context/AuthProvider.tsx";
import {ToastContainer} from "react-toastify";
import App from "./App.tsx";
import "./index.css";

// Use ReactDOM.createRoot to create a root for concurrent mode rendering
ReactDOM.createRoot(document.getElementById("root")!).render(
  // StrictMode is used for detecting common mistakes in the application
  <React.StrictMode>
    {/* BrowserRouter provides routing capabilities to the application */}
    <BrowserRouter>
      {/* AuthProvider manages authentication state across the application */}
      <AuthProvider>
        {/* ToastContainer displays toast notifications globally in the application */}
        <ToastContainer />

        {/* Routes component for defining application routes */}
        <Routes>
          {/* Route for the App component, rendered when the path matches "/*" */}
          <Route path="/*" element={<App />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
