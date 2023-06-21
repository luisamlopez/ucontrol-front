import { Navigate, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import History from "./pages/History";
import Login from "./pages/Login";
import Register from "./pages/Register";
import SpacePage from "./pages/SpacePage";
import DevicesPage from "./pages/DevicesPage";
import ConfigDevice from "./pages/ConfigDevice";

const App = (): JSX.Element => {
  return (
    <>
      <Routes>
        <Route path="/dashboard" element={<Home />} />
        <Route path="/" element={<Navigate to="/dashboard" replace />} />

        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Register />} />
        <Route path="/history" element={<History />} />
        <Route path="/spaceID/:spaceID" element={<SpacePage />} />
        <Route path="/devices" element={<DevicesPage />} />
        <Route path="/devices/:action/:deviceID?" element={<ConfigDevice />} />

        {/*<Route path="/spaces" element={<Spaces />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/help" element={<Help />} />
        */}
      </Routes>
    </>
  );
};

export default App;
