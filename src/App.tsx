import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import History from "./pages/History";
import Login from "./pages/Login";

const App = (): JSX.Element => {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/history" element={<History />} />
        {/* <Route path="/devices" element={<Devices />} />
        <Route path="/spaces" element={<Spaces />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/help" element={<Help />} />
        */}
      </Routes>
    </>
  );
};

export default App;
