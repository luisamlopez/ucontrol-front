import { Navigate } from "react-router-dom";
import { useUser } from "../contexts/authContext";

interface Props {
	children: JSX.Element;
}

const Auth = ({ children }: Props): JSX.Element => {
	const { user } = useUser();

	if (!user) {
		return <Navigate to="/login" replace />;
	}

	return children;
};

export default Auth;
