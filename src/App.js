import { CssBaseline, ThemeProvider } from "@mui/material";
import { useEffect, useMemo } from "react";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import "./App.css";
import Auth from "./pages/auth";
import Dashboard from "./pages/dashboard";
import { getTheme } from "./theme";
import Storage from "./utils/localStore";

function App() {
  const isLoggedIn = Storage.get("token");
  const navigate = useNavigate();
  const location = useLocation();
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
      path: "/api/v1/resetPassword/:id/:token",
      element: <Auth />,
    },
    {
      path: "*",
      element: <p>Page Not Found</p>,
    },
  ];
  const authentication = (path) => {
    if (path === "/") {
      if (isLoggedIn) {
        navigate("/dashboard");
      } 
    } else {
      if (!isLoggedIn) {
        if(!location.pathname.includes("/resetPassword")) {
          navigate("/");
        }
      }
    }
  };
  useEffect(() => {
    authentication(location.pathname);
    const titles = {
      "/": "Login | Taskfolio",
      "/dashboard": "Dashboard | Taskfolio",
    };
    document.title = titles[location.pathname] || "Taskfolio";
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
