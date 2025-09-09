// import React from "react";
// import ReactDOM from "react-dom/client";
// import { BrowserRouter } from "react-router-dom";
// import App from "./App";
// import "./index.css"; // Tailwind styles
// import "./fonts.css"; // fonts

// ReactDOM.createRoot(document.getElementById("root")).render(
//   <React.StrictMode>
//     <BrowserRouter basename="/" >
//       <App />
//     </BrowserRouter>
//   </React.StrictMode>
// );

// import ReactDOM from "react-dom/client";
// import { BrowserRouter } from "react-router-dom";
// import App from "./App";
// import "./index.css"; // Tailwind CSS

// const root = ReactDOM.createRoot(document.getElementById("root"));
// root.render(
//   <BrowserRouter basename="/">
//     <App />
//   </BrowserRouter>
// );

import React from "react";
import ReactDOM from "react-dom/client";
import { HashRouter } from "react-router-dom";
import App from "./App";
import "./index.css";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <HashRouter>
    <App />
  </HashRouter>
);

