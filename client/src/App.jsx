import "./App.css";
import { Route, Routes } from "react-router-dom";
import RootLayout from "./components/Layout";
import HomePage from "./pages/HomePage";
import SignUp from "./pages/SignUpPage";
import "@mantine/core/styles.css";
import PrivateRoute from "./components/PrivateRoute.jsx";
import { createTheme, MantineProvider } from "@mantine/core";
import Login from "./pages/LoginPage.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";

function App() {
  const theme = createTheme({});
  return (
    <MantineProvider theme={theme}>
      <Routes>
        <Route path="/" element={<RootLayout />}>
          {/* protected routes */}
          <Route element={<PrivateRoute />}>
            <Route path="/profile" element={<ProfilePage />} />
            <Route index element={<HomePage />}></Route>
          </Route>
          {/* nonprotected routes */}
          <Route path="signin" element={<SignUp />}></Route>
          <Route path="login" element={<Login />}></Route>
        </Route>
      </Routes>
    </MantineProvider>
  );
}

export default App;
