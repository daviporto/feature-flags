import { defineRouter } from '#q-app/wrappers';
import {
  createMemoryHistory,
  createRouter,
  createWebHashHistory,
  createWebHistory,
} from 'vue-router';
import routes from './routes';
import { useAuthStore } from 'stores/auth';
import { Routes } from 'src/enums/Routes';

export default defineRouter(function (/* { store, ssrContext } */) {
  const createHistory = process.env.SERVER
    ? createMemoryHistory
    : process.env.VUE_ROUTER_MODE === 'history'
      ? createWebHistory
      : createWebHashHistory;

  const Router = createRouter({
    scrollBehavior: () => ({ left: 0, top: 0 }),
    routes,

    // Leave this as is and make changes in quasar.conf.js instead!
    // quasar.conf.js -> build -> vueRouterMode
    // quasar.conf.js -> build -> publicPath
    history: createHistory(process.env.VUE_ROUTER_BASE),
  });

  Router.beforeEach(async (to, from, next) => {
    const authStore = useAuthStore();

    if (!authStore.user?.token) {
      await authStore.initializeAuth();
    }

    if (to.meta.requiresAuth) {
      console.log(authStore.isAuthenticated, 'auth');
      if (authStore.isAuthenticated) {
        next();
      } else {
        next({
          name: Routes.SIGN_IN,
          query: {
            callbackUrl: to.fullPath,
          },
        });
      }
    } else {
      next();
    }
  });

  return Router;
});
