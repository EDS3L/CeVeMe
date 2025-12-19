class UserService {
  getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
  }

  getEmailFromToken(token) {
    const tokenPayload = token.split('.')[1];
    const decodedPayload = JSON.parse(atob(tokenPayload));
    return decodedPayload.sub;
  }
  getIdFromToken(token) {
    const tokenPayload = token.split('.')[1];
    const decodedPayload = JSON.parse(atob(tokenPayload));
    return decodedPayload.jti;
  }
  getRoleFromToken(token) {
    if (!token) return null;
    const tokenPayload = token.split('.')[1];
    const decodedPayload = JSON.parse(atob(tokenPayload));
    return decodedPayload.role;
  }
}

export default UserService;
