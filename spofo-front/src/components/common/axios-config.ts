import axios from 'axios';
import UrlPattern from 'url-pattern';
import { useRouter } from 'vue-router';

const router = useRouter();
const instance = axios.create();
const pattern = new UrlPattern('(http(s)\\://)(:subdomain.):domain.:tld(\\::port)(/*)');
const needsAuthDomain = ['portfolio', 'auth'];

instance.interceptors.request.use(
  function (config) {
    if (needsAuthDomain.includes(pattern.match(config.url!).subdomain, 0)) {
      const idToken = localStorage.getItem('authorization') || '';

      if (idToken != null && config.headers != null) {
        config.headers.Authorization = `${idToken}`;
        config.headers['socialType'] = localStorage.getItem('socialType') || '';
      }
    }

    return config;
  },
  function (error) {
    // 요청 오류가 있는 작업 수행
    return Promise.reject(error);
  }
);


instance.interceptors.response.use(
  function (response) {
    // 200대 response를 받아 응답 데이터를 가공하는 작업
    return response;
  },
  function (error) {
    // 401 에러를 반환받았을 때 로그인 화면으로 이동
    console.log(error);
    if (error.response.status === '401') {
      router.push({ name: '/login' });
    }
    return Promise.reject(error);
  }
);

export default instance;
