import { createRouter, createWebHistory } from 'vue-router';
import loginService from '../components/services/login-service';
import { ElNotification } from 'element-plus';
import UrlPattern from 'url-pattern';
import authService from '@/components/services/auth-service';
import portfolioService from '@/components/services/portfolio-service';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'main',
      component: () => import('@/views/MainView.vue')
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/LoginView.vue'),
      meta: {
        title: 'SPOFO 로그인'
      }
    },
    {
      path: '/kakao',
      name: 'kakaoLogin',
      component: {},
      meta: { isLoginProcess: true, socialType: 'KAKAO' },
      beforeEnter: (to, from, next) => {
        loginService
          .doLoginProcess(to.meta.socialType as string, to.query.code as string)
          .then(() => {
            ElNotification({
              title: '알림',
              message: '로그인 하였습니다.',
              position: 'bottom-left',
              type: 'success'
            });

            next('/');
          })
          .catch((error) => console.log(error));
      }
    },
    {
      path: '/my/portfolios',
      name: 'portfolios',
      component: () => import('@/views/PortfoliosView.vue'),
      meta: {
        title: 'SPOFO 포트폴리오 관리'
      },
      beforeEnter: (to, from, next) => {
        portfolioService
          .getPortfolioSimples()
          .then((response) => {
            console.log(response);
            if (response.data.length == 0) {
              // 포트폴리오 없는 경우 포폴 만들기 화면으로 보내기
              router.push({ name: 'portfolioCreate' });
            }
            next();
          })
          .catch((error) => {
            console.log(error);
          });
      }
    },
    {
      path: '/my/portfolio',
      name: 'portfolio',
      component: () => import('@/views/PortfolioView.vue'),
      meta: {
        title: 'SPOFO 포트폴리오 관리'
      }
    },
    {
      path: '/my/portfolio/create/selection',
      name: 'portfolioCreateSelection',
      component: () => import('@/views/PortfolioCreateSelectionView.vue'),
      meta: {
        title: 'SPOFO 포트폴리오 추가'
      }
    },
    {
      path: '/my/portfolio/create',
      name: 'portfolioCreate',
      component: () => import('@/views/PortfolioCreateView.vue'),
      meta: {
        title: 'SPOFO 포트폴리오 추가'
      }
    },
    {
      path: '/my/portfolio/stock/create',
      name: 'portfolioStockCreate',
      component: () => import('@/views/CreateStockView.vue'),
      meta: {
        title: 'SPOFO 포트폴리오 종목 추가'
      }
    }
  ]
});

router.beforeEach(function (to, from, next) {
  const pattern = new UrlPattern('/my/*');

  if (to.path.indexOf('/my/') > -1) {
    const idToken = localStorage.getItem('authorization') || '';
    if (idToken) {
      authService
        .verifyToken()
        .then(() => next())
        .catch((error) => {
          needsLoginMessage();
          next('/login');
        });
    } else {
      needsLoginMessage();
      next('/login');
    }
  } else {
    next();
  }
});

router.afterEach((to, from) => {
  document.title = to.meta.title === undefined ? 'SPOFO' : (to.meta.title as string);
});

const needsLoginMessage = () => {
  ElNotification({
    title: '알림',
    message: '다시 로그인이 필요합니다.',
    position: 'bottom-left',
    type: 'error'
  });
};

export default router;
