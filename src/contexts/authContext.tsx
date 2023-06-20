import { createContext, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Log, User, signIn } from "../api/User";

interface Props {
	children: React.ReactNode;
}

interface AuthContextValue {
	user: User | null;
	login: (userBody: Log) => void;
}

const useUser = () => {
	return useContext(AuthContext);
};

const AuthContext = createContext<AuthContextValue>({
	user: {} as User,
	login: () => {},
});

const AuthContextProvider = ({ children }: Props): JSX.Element => {
	const [user, setUser] = useState<User | null>(() => {
		let userData = localStorage.getItem("userData");
		if (userData) {
			return JSON.parse(userData);
		}
		return null;
	});

	const navigate = useNavigate();

	const login = async (userBody: Log) => {
		const userApi = await signIn(userBody);
		console.log(userApi);
		localStorage.setItem("userData", userApi);
		setUser(userApi);
		navigate("/");
	};

	return (
		<AuthContext.Provider value={{ user, login }}>
			{children}
		</AuthContext.Provider>
	);
};

export { useUser, AuthContextProvider };
