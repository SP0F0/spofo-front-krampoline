import axios from '../common/axios-config';
import { loginStore } from '@/stores/login-store';
import { Member } from '@/components/models/member';
import authService from '@/components/services/auth-service';

class LoginService {
  doLoginProcess(socialType: string, code: string) {
    const requestUrl = this.getTokenRequestUrl(socialType, code);
    return axios
      .get(requestUrl)
      .then((response) => response.data.id_token)
      .then(async (idToken) => {
        const payload = (await import('@/components/services/jwt-decoder')).default.decode(idToken);

        this.addMember(socialType, payload).then(() =>
          this.storeLoginInfo(socialType, idToken, payload)
        );
      });
  }

  getTokenRequestUrl(socialType: string, code: string) {
    // 카카오
    const kakaoAuthRequestUrl = import.meta.env.VITE_KAKAO_AUTH_REQUEST_URL;
    const kakaoClientId = import.meta.env.VITE_KAKAO_CLIENT_ID;
    const kakaoRedirectUri = import.meta.env.VITE_KAKAO_REDIRECT_URI;
    const grantType = import.meta.env.VITE_GRANT_TYPE;

    return `${kakaoAuthRequestUrl}/token?grant_type=${grantType}&client_id=${kakaoClientId}&redirect_uri=${kakaoRedirectUri}&code=${code}`;
  }

  async addMember(platform: string, payload: any) {
    authService.addMember({
      platform: platform,
      socialId: payload.sub
    });
  }

  storeLoginInfo(socialType: string, idToken: string, payload: any) {
    const useLoginStore = loginStore();

    localStorage.setItem('socialType', socialType);
    localStorage.setItem('authorization', `Bearer ${idToken}`);
    useLoginStore.login(new Member(payload.nickname, payload.picture));
  }
}

const loginService = new LoginService();

export default loginService;
