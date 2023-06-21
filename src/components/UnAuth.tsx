import { Navigate } from "react-router-dom";
import { useUser } from "../contexts/authContext";

interface Props {
	children: JSX.Element;
}

const UnAuth = ({ children }: Props): JSX.Element => {
	const { user } = useUser();

	if (user) {
		return <Navigate to="/home" replace />;
	}

	return children;
};

export default UnAuth;
