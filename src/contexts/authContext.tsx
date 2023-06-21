import { createContext, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Log, User, signIn } from "../api/User";

interface Props {
	children: React.ReactNode;
}

interface AuthContextValue {
	user: User | null;
	login: (userBody: Log) => void;
	logout: () => void;
}

const useUser = () => {
	return useContext(AuthContext);
};

const AuthContext = createContext<AuthContextValue>({
	user: {} as User,
	login: () => {},
	logout: () => {},
});

const AuthContextProvider = ({ children }: Props): JSX.Element => {
	const [user, setUser] = useState<User | null>(() => {
		let userData = localStorage.getItem("userData");

		if (userData) {
			return JSON.parse(userData);
		}
		return null;
	});

	const login = async (userBody: Log) => {
		//TODO revisar respuesta a errores
		const data = await signIn(userBody);
		const { user } = data;
		localStorage.setItem("userData", user);
		setUser(user);
	};

	const logout = () => {
		localStorage.removeItem("userData");
		setUser(null);
	};

	return (
		<AuthContext.Provider value={{ user, login, logout }}>
			{children}
		</AuthContext.Provider>
	);
};

export { useUser, AuthContextProvider };
