<template>
  <div class="">
    <div>
    </div>
    <div class="text-center toggle-group">
      <button class="toggle-button" @click="activeTab = 'friends'"><span class="normal-font">Friends List</span>
      </button>
      <button class="toggle-button" @click="activeTab = 'requests'"><span class="normal-font">Requests</span>
      </button>
      <button class="toggle-button" @click="activeTab = 'chat'" v-show="conversationActive || callRequest"><span class="normal-font">Chat</span>
      </button>
    </div>
    <div class="friendsList text-center" v-if="activeTab === 'friends'">
      <div class="friend" v-for="friend in friendsList">
        <span class="normal-font text-left">{{ friend.username }}</span>
        <img src="../../assets/camera.png" class="cam" @click="call(friend.username)">
      </div>
    </div>
    <div class="friendsList text-center" v-if="activeTab === 'requests'">
      <div class="friend" v-for="request in requestsList">
        <span class="normal-font">{{ request.senderUserName }}</span>
        <img src="../../assets/accept.png" class="cam" @click="acceptRequest(request.senderId,request.requestId)">
      </div>
    </div>
    <div class="friendsList" v-if="activeTab === 'chat' && (conversationActive || callRequest)">
        <app-messages :messageList="messageList" :callerUser="callerUser" @getMessage="sendMessage"></app-messages>
        {{callRequest}}
    </div>
    <div class="searchFriend text-center" v-if="activeTab === 'searchFriend'">
      <input class="search-input mt-3" v-model="searchUser" @keyup.enter="searchFriend(searchUser)">
      <hr class="w-75">
      <div class="users">
        <div class="user" v-for="user in users">
          <span class="normal-font">{{ user.username }}</span>
          <img src="../../assets/addnew.png" class="cam" @click="sendRequest(user.userId,user.username)">
        </div>
      </div>
    </div>
    <button class="button-holder" @click="activeTab='searchFriend'">
      <span class="normal-font">Search Friends</span>
    </button>
  </div>
</template>

<script>
import axios from 'axios';
import {requests} from "../../common/requests";
import Socket from "../../common/socket"
import messages from "./messagesComponent";
import addNewFriend from "./addNewFriend";
export default {
  name: "leftside",
  props: ["friendsList", "requestsList","callRequest","newMessage","callerUser"],
  components: {
      appMessages:messages
  },
  data() {
    return {
      activeTab: "friends",
      searchUser: null,
      users: [],
      conversationActive : false,
      messageList : [],
      calledUser : null
    }
  },
  methods: {
    acceptRequest(requestOwnerId, reqId) {
      requests.acceptRequest(requestOwnerId, reqId).then(response => {
        console.log("başarılı")

      });
    },
    searchFriend(value) {
      if (value !== null || value !== '') {
        requests.searchFriend(value).then(response => {
          console.log(response)
          this.users = response.data;
        })
      } else {
        this.user = [];
      }
    },
    sendRequest(userId,username) {
      requests.sendRequest(userId);
      Socket.send({
        event: "friendRequest",
        dest: username,
        data: "Yeni bir arkadaş isteğin var!!"
      });

    },
    call(callingUsername) {
      this.conversationActive = true;
      this.calledUser = callingUsername;
      this.$emit('messageFromChild', callingUsername)
    },
    getUserInfo() {
      this.$emit("friendRequestFromChild");
    },
    sendMessage(userName,messageData){
      this.messageList.push({
        messageFrom : "me",
        messageData : messageData
      })
      Socket.send({
        event: 'text-message',
        dest : this.calledUser,
        data: messageData
      })
    }
  },
  watch: {
    friendsList: function (newVal, oldVal) { // watch it
      console.log('Prop changed: ', newVal, ' | was: ', oldVal)
    },
    callRequest: function (newVal,oldVal){
      console.log(newVal)
    },
    newMessage: function (newVal,oldVal){
      if(newVal !== null){
        this.messageList.push({
          messageFrom : "other",
          messageData : newVal
        })
      }
    },
    callerUser : function(newVal,oldVal){
        if(newVal != null){
          this.calledUser = newVal;
        }
    }
  }
  // watch: {
  //     friendsList: function (nevValue) {
  //         this.friendList = nevValue;
  //     },
  //     requestsList : function (nValue) {
  //         this.requestList = nValue;
  //
  //     }
  //
  // },
}
</script>

<style scoped>
.friend {
  background-color: #0C0F2A;
  width: 70%;
  height: 75px;
  margin-left: auto;
  margin-right: auto;
  border-radius: 10px;
  margin-top: 15px;

}

.searchFriend {
  height: 500px;
  overflow-y: auto;
  background-color: white;
  width: 95%;
  margin-left: auto;
  margin-right: auto;
  margin-top: 15px;
}

/*.users{*/
/*  height: 350px;*/
/*  width: 95%;*/
/*  margin-left: auto;*/
/*  margin-right: auto;*/

/*}*/
.user {
  width: 80%;
  background-color: #272D33;
  border-radius: 10px;
  margin-left: auto;
  margin-right: auto;
  margin-top: 10px;
}

.cam {
  margin-left: 15px;
  margin-top: auto;
  margin-bottom: auto;
  cursor: pointer;
}

.friendsList {
  height: 500px;
  overflow-y: auto;
}

.toggle-button {
  border: 0;
  margin-top: 25px;
  background-color: #272D33;
  width: 120px;
  height: 80px;
  font-size: 12px;
}

.toggle-button-active {
  border: 0;
  margin-top: 25px;
  background-color: #5ec46f;
  width: 200px;
  height: 80px;
}

.normal-font {
  color: white;
  font-size: 16px;

}
.friendsList{
  background: white;
  margin: 12px;
}
.friendsList::-webkit-scrollbar {
  width: 10px;
  background-color: #F5F5F5;
}

.friendsList::-webkit-scrollbar-track {
  -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
  background-color: #F5F5F5;
}

.friendsList::-webkit-scrollbar-thumb {
  background-color: #0ae;

  background-image: -webkit-gradient(linear, 0 0, 0 100%,
  color-stop(.5, rgba(255, 255, 255, .2)),
  color-stop(.5, transparent), to(transparent));
}

.button-holder {
  width: 70%;
  height: 50px;
  bottom: 10px;
  position: absolute;
  margin-left: 50px;
  margin-right: 50px;
  background-color: #0C0F2A;
  border: 0;

}
</style>
