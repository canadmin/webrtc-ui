import Vue from "vue";
import store from "../store/store";

const socket = new WebSocket("ws://18.196.21.191/socket");

const emitter = new Vue({
  methods:{
    send(message){
      console.log("socket gonderim")
      if(socket.readyState === 1){
        socket.send(JSON.stringify(message));
      }
    },
    callUser(callingUsername){
    }
  },

});

socket.onclose = function (e) {
  emitter.$emit("close", e)
}
socket.onerror = function (e) {
  emitter.$emit("error", e)
}
socket.onmessage = function (msg) {
  emitter.$emit("message",msg.data)
}
socket.onopen = function (e) {
  this.send(
    JSON.stringify(
      {
        event: "login",
        data: store.getters.getUsername.toString()
      }
    )
  );
};
export default emitter;
