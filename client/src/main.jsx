import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { store } from "./app/store";
import { Provider } from "react-redux";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <Router>
        <Routes>
          <Route path="/*" element={<App />}></Route>
        </Routes>
      </Router>
    </Provider>
  </StrictMode>,
);
