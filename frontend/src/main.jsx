import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { Toaster } from "react-hot-toast";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
    <Toaster
      position="top-right"
      toastOptions={{
        style: {
          background: '#fff',
          color: '#333',
          fontSize: '14px',
          border: '1px solid #ddd',
        },
        success: {
          iconTheme: {
            primary: '#10b981', // tailwind green-500
            secondary: '#ecfdf5',
          },
        },
        error: {
          iconTheme: {
            primary: '#ef4444', // tailwind red-500
            secondary: '#fee2e2',
          },
        },
      }}
    />
  </React.StrictMode>
);
