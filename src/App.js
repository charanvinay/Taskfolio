import { CssBaseline, ThemeProvider } from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import "./App.css";
import Auth from "./pages/auth";
import Dashboard from "./pages/dashboard";
import { getTheme } from "./theme";
import Storage from "./utils/localStore";

function App() {
  const isLoggedIn = Storage.get("token");
  const navigate = useNavigate();
  const theme = useMemo(() => getTheme("light"), []);
  const ROUTES = [
    {
      path: "/dashboard",
      element: <Dashboard />,
    },
    {
      path: "/",
      element: <Auth />,
    },
    {
      path: "*",
      element: <p>Page Not Found</p>,
    },
  ];
  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/")
    }
  }, [isLoggedIn]);
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Routes>
        {ROUTES.map(({ path, element }) => (
          <Route path={path} element={element} key={path} />
        ))}
      </Routes>
    </ThemeProvider>
  );
}

export default App;
