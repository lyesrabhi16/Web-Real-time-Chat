import { Navigate, useLocation } from "react-router";
import PropTypes from "prop-types";
import { useAppStore } from "../store.jsx";

const ProtectedRoute = (props) => {
	const { user } = useAppStore();
  const location = useLocation();
	return user ? <>{props.children}</> : <Navigate to={`/login?to=${location.pathname}`}/>;
};

ProtectedRoute.propTypes = {
	children: PropTypes.node.isRequired,
};

export default ProtectedRoute;
