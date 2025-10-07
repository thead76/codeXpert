import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { AuthProvider } from "./context/AuthContext"; 
import "react-datepicker/dist/react-datepicker.css";
import "./index.css";
import "./fonts.css";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    {/* BrowserRouter needs to wrap AuthProvider and App for routing to work correctly */}
    <BrowserRouter>
      {/* AuthProvider wraps your App, making the login status available everywhere */}
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
