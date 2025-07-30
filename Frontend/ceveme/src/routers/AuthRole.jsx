import { Navigate } from 'react-router-dom';
import UserService from '../services/user/UserService';
import PropTypes from 'prop-types';
import Forbidden from '../pages/errors/403';

function AuthRole({ children, requiredRole }) {
  const userService = new UserService();
  const token = localStorage.getItem('token');
  const role = userService.getRoleFromToken(token);

  if (token == null) return <Navigate to="/auth" replace />;

  if (
    !requiredRole ||
    (Array.isArray(requiredRole) && requiredRole.includes(role))
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
