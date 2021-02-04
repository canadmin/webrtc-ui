<template>
<div class="message-main">
  <div class="message-panel">
    <div  v-for="message in messageList">
      <div :class="message.messageFrom === 'me' ? 'received-message  float-right  mt-3':'sent-message float-left mt-3'" class="">{{message.messageData}}</div>
    </div>
  </div>
  <div class="message-sub-bar text-center">
    <input type="text" v-model="message">
    <button @click="sendMessage(message)">Send</button>
  </div>
</div>
</template>

<script>
export default {
  name: "messages",
  props: ["messageList","receiver"],
  data(){
    return{
      message:''
    }
  },
  methods:{
    sendMessage(message){
      if(message!== '' || message !== ' ' ){
        this.$emit('getMessage',this.receiver,message)
        this.message = ''
      }

    }
  }
}
</script>

<style scoped>
.message-main{
   position: relative;
   min-height: 500px;
}
.message-sub-bar{
  position: absolute;
  bottom: 0;
  display: block;
  width: 100%;
  padding-bottom: 10px;
}
input{
  width: 70%;
  border-radius: 5px;
  border: 0;
  box-shadow: 0 0 0 1px rgba(0, 0, 0, .15), 0 2px 3px rgba(0, 0, 0, .2);
  background-color: #f5f5f5;
  height: 35px;
  padding-left: 10px;
}
button{
  width: 20%;
}
.message-panel{
  height: 450px;
  overflow-y: visible;
  overflow-x: hidden;
  background-color: #F5F5F5;
  box-shadow: 0 0 0 1px rgba(0, 0, 0, .15), 0 2px 3px rgba(0, 0, 0, .2);
  transition: box-shadow 83ms;
  padding-bottom: 45px;
}
.sent-message{
  padding: 10px;
  background: #6f42c1;
  margin: 10px;
  width: 60%;
  display: inline-flex;

  border-radius: 0 10px 10px 10px;
}
.received-message{
  padding: 10px;
  display: inline-flex;
  width: 60%;
  margin: 10px;
  background: #ff00dd;
  border-radius: 10px 0 10px 10px;
}
</style>
