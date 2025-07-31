class UserService {
  getUsernameFromToken(token) {
    const tokenPayload = token.split('.')[1];
    const decodedPayload = JSON.parse(atob(tokenPayload));
    return decodedPayload.sub;
  }

  getRoleFromToken(token) {
    if (!token) return null;
    const tokenPayload = token.split('.')[1];
    const decodedPayload = JSON.parse(atob(tokenPayload));

    return decodedPayload.role;
  }
}

export default UserService;
