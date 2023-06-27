import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Log, User, signIn } from "../api/User";

interface Props {
	children: React.ReactNode;
}

interface AuthContextValue {
	user: User | null;
	login: (userBody: Log) => Promise<{ success: boolean; message?: string }>;
	logout: () => void;
}

const useUser = () => {
	return useContext(AuthContext);
};

const AuthContext = createContext<AuthContextValue>({
	user: {} as User,
	login: async (userBody: Log) => {
		throw new Error("AuthContext not implemented");
	},
	logout: () => {},
});

const AuthContextProvider = ({ children }: Props): JSX.Element => {
	const [user, setUser] = useState<User | null>(() => {
		let userData = localStorage.getItem("userData");
		if (userData) {
			console.log(userData);
			return JSON.parse(userData);
		}
		return null;
	});

	const login = async (userBody: Log) => {
		//TODO revisar respuesta a errores
		try {
			const response = await signIn(userBody);
			if (response.success) {
				localStorage.setItem("userData", JSON.stringify(response.user));
				setUser(response.user);
			}
			return { success: response.success, message: response.message };
		} catch (error) {
			if (error instanceof Error) {
				throw new Error(error.message);
			} else return { success: false, message: "Hubo un error desconocido" };
		}
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
