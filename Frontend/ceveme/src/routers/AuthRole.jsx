import { Navigate } from "react-router-dom";
import PropTypes from "prop-types";
import Forbidden from "../pages/errors/403";
import { useAuthContext } from "../features/auth/context/useAuthContext";

function AuthRole({ children, requiredRole }) {
  const { user, isLoading } = useAuthContext();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    ); // Or a proper spinner
  }

  if (!user) {
    return <Navigate to="/auth/login" replace />;
  }

  if (
    !requiredRole ||
    (Array.isArray(requiredRole) && requiredRole.includes(user.role))
  ) {
    return children;
  }

  return <Forbidden />;
}

AuthRole.propTypes = {
  children: PropTypes.node,
  requiredRole: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.arrayOf(PropTypes.string),
  ]),
};

export default AuthRole;
