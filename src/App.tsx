import { Navigate, Outlet, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import History from "./pages/History";
import Login from "./pages/Login";
import Register from "./pages/Register";
import SpacePage from "./pages/SpacePage";
import DevicesPage from "./pages/DevicesPage";
import { AuthContextProvider } from "./contexts/authContext";
import UnAuth from "./components/UnAuth";
import Auth from "./components/Auth";
import ConfigDevice from "./pages/ConfigDevice";
import SpacesPage from "./pages/SpacesPage";
import ConfigSpace from "./pages/ConfigSpace";

const App = (): JSX.Element => {
	return (
		<>
			<AuthContextProvider>
				<Routes>
					<Route
						element={
							<UnAuth>
								<Outlet />
							</UnAuth>
						}
					>
						<Route path="/login" element={<Login />} />
						<Route path="/signup" element={<Register />} />
						<Route path="/forgot-password" element={<Register />} />
					</Route>
					<Route
						element={
							<Auth>
								<Outlet />
							</Auth>
						}
					>
						<Route path="/dashboard" element={<Home />} />
						<Route path="/" element={<Navigate to="/dashboard" replace />} />

						<Route path="/history" element={<History />} />
						<Route path="/spaceID/:spaceID" element={<SpacePage />} />
						<Route path="/devices" element={<DevicesPage />} />

            <Route
              path="/devices/:action/:deviceID?"
              element={<ConfigDevice />}
            <Route path="/spaces" element={<SpacesPage />} />
            />
            <Route path="/spaces/:action/:spaceID?" element={<ConfigSpace />} />

            {/*
        <Route path="/settings" element={<Settings />} />
        <Route path="/help" element={<Help />} />
        */}
					</Route>
				</Routes>
			</AuthContextProvider>
		</>
	);
};

export default App;
