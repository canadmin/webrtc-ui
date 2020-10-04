import Vue from 'vue'
import Router from 'vue-router'
import Login from "../components/Login";
import Main from "../components/view/Main";
import store from "../store/store";
import Room from "../components/rooms/Room"

Vue.use(Router)

export const router = new Router({
  routes: [
    {
      path: '/auth',
      name: 'login',
      component: Login
    },
    // {
    //   path: "/",
    //   component: Main,
    //   beforeEnter(to, from, next) {
    //     if (!store.getters.isAuthenticated) {
    //       next();
    //     } else {
    //       next("/auth");
    //     }
    //   }
    // },
    {
      path: "/",
      component: Room,
      beforeEnter(to, from, next) {
        if (!store.getters.isAuthenticated) {
          next();
        } else {
          next("/auth");
        }
      }
    }
  ],
  mode: "history"
});
