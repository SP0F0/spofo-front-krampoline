import axios from '../common/axios-config';

class AuthService {
  authServer = import.meta.env.VITE_AUTH_SERVER;

  verifyToken() {
    return axios.get(this.authServer + '/auth/members/search');
  }

  addMember(loggedInMemberInfo: any) {
    return axios.put(this.authServer + '/auth/members', loggedInMemberInfo);
  }
}

const authService = new AuthService();

export default authService;
