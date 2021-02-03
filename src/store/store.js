import Vue from 'vue';
import Vuex from 'vuex';
import axios from "axios";
import {router} from "../router";
import {url} from "../common/requests"
Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    token: "",
    username:"",
    userId : ""
  },
  mutations: {
    setToken(state, data) {
      state.token = data;
      },
    clearUser(state) {
      state.token = "";
    },
    setUserId(state,data){
      state.userId = data;
    },
    setUsername(state,data){
      state.username = data;
    }

  },
  actions: {

    initAuth({commit,dispatch}){
        let token = localStorage.getItem("token");
        if (token){
            commit("setToken",token)
            router.push("/")
        }
        else{
          router.push("/auth")
          return false;
        }
    },
    getUserInfo({commit,dispatch}){
      let userId = localStorage.getItem('userId');
      let username = localStorage.getItem('username');

      commit('setUserId',userId);
      commit('setUsername',username)
    },
    login({commit, dispatch, state}, authData) {
      if (authData.isUser === false) {
       axios.post(url + "signup",
          {username: authData.username, password: authData.password, fullName : authData.fullName})
          .then(response => {
            console.log(response)
          })
      } else {
        return axios.post(url + "login",
          {username: authData.username, password: authData.password})
          .then(response => {
            console.log(response.data)
            commit('setToken', response.data.Token);
            localStorage.setItem('token',response.data.Token);
            localStorage.setItem('userId',response.data.User.userId);
            localStorage.setItem('username',response.data.User.username);
            localStorage.setItem('fullName',response.data.User.fullName)

          })
      }
    },
    logout({commit, dispatch, state}) {

    },
  },
  getters: {
    isAuthenticated(state){
      return state.token ==="";
    },
    getUsername(state){
      return state.username;
    },
    getUserId(state){
      return state.userId;
    },
    getToken(state){
        return state.token;
    }

  }
})

export default store
