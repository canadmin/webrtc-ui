<template>
  <div class="container-fluid">
    <div class="row">
      <div class="col-3  " style="height: 100vh">
        <div class="left-side">
          <div class="text-center mt-5">
            <span class="font-custom ">Barancan Yardımcı</span>
          </div>
          <div class="text-center toggle-group">
            <button class="toggle-button" @click="activeTab = 'friends'"><span class="normal-font">Friends List</span>
            </button>
            <button class="toggle-button" @click="activeTab = 'requests'"><span class="normal-font">Requests</span>
            </button>
          </div>
          <div class="friendsList text-center" v-if="activeTab === 'friends'">
            <div class="friend" v-for="friend in friendList">
              <img src="../../assets/camera.png" class="cam">
            </div>
          </div>
          <div class="friendsList text-center" v-if="activeTab === 'requests'">
            <div class="friend" v-for="request in requestList">
              <span class="normal-font">{{request.senderUserName}}</span>
              <img src="../../assets/accept.png" class="cam" @click="acceptRequest(request.senderId,request.requestId)">
            </div>
          </div>
          <button class="button-holder">
            <span class="normal-font">Add new friend</span>
          </button>
        </div>
      </div>
      <div class="col-9 h-100">
        <div class="right-side"></div>
      </div>


    </div>
  </div>
</template>

<script>
    import axios from 'axios';
     let qs = require('qs');

    export default {
        name: "Main",
        data() {
            return {
                friendList: [],
                requestList: [],
                activeTab: "friends"
            }
        },
        methods: {
            getUserInfo() {
                console.log(this.$store.getters.getToken)
                axios.get('http://localhost:8081/api/getUserInfo', {
                    params: {
                        userId: this.$store.getters.getUserId.toString()
                    },
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': this.$store.getters.getToken.toString()

                    },
                }).then((response) => {
                    console.log(response.data)
                    this.friendList = response.data.friends;
                    this.requestList = response.data.requests;

                })
            },
            acceptRequest(requestOwnerId,reqId) {
                console.log(requestOwnerId);
                let data = {
                    myId :this.$store.getters.getUserId.toString(),
                    senderId : requestOwnerId.toString(),
                    reqId : reqId
                }
                axios.post('http://localhost:8081/api/acceptRequest',{} ,{
                        headers: {
                            'Authorization': this.$store.getters.getToken.toString(),
                            'Content-Type': 'application/json',
                        },
                        params :data
                    }
                    ).
                then((response) => {
                    console.log(response.data)
                })
            }
        },
        created() {
            this.$store.dispatch('getUserInfo');
            this.getUserInfo();
        }
    }
</script>

<style scoped>
  #profileImage {
    height: 30%;
    width: 80%;
    border-radius: 50%;
    background: #00a8a7;
    font-size: 70px;
    color: #fff;
    padding-top: 50px;
    text-align: center;
    cursor: pointer;
  }

  .left-side {
    width: 100%;
    margin-top: 50px;
    background-color: #383C40;
    height: 90vh;
    position: relative;
    margin-right: auto;
    -webkit-box-shadow: 1px 0px 43px 0px rgba(0, 0, 0, 0.75);
    -moz-box-shadow: 1px 0px 43px 0px rgba(0, 0, 0, 0.75);
    box-shadow: 1px 0px 43px 0px rgba(0, 0, 0, 0.75);
    margin-left: auto;
    border-radius: 10px;


  }

  .right-side {
    width: 100%;
    margin-top: 50px;
    background-color: #272D33;
    -webkit-box-shadow: 1px 0px 43px 0px rgba(0, 0, 0, 0.75);
    -moz-box-shadow: 1px 0px 43px 0px rgba(0, 0, 0, 0.75);
    box-shadow: 1px 0px 43px 0px rgba(0, 0, 0, 0.75);
    height: 90vh;
    border-radius: 10px;
    position: relative;
  }

  .font-custom {
    font-size: 40px;
    color: white;
  }

  .normal-font {
    color: white;
    font-size: 20px;

  }

  .friend {
    background-color: #0C0F2A;
    width: 70%;
    height: 75px;
    margin-left: auto;
    margin-right: auto;
    border-radius: 10px;
    margin-top: 15px;

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
    width: 200px;
    height: 80px;
  }

  .toggle-button-active {
    border: 0;
    margin-top: 25px;
    background-color: #5ec46f;
    width: 200px;
    height: 80px;
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
