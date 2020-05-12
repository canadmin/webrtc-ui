<template>
  <div class="container-fluid">
    <div class="row">
      <div class="col-3  " style="height: 100vh">
        <div class="left-side">
          <div class="text-center mt-5">
            <span class="font-custom ">Barancan Yardımcı</span>
          </div>
          <app-leftside :friendsList="leftData.friendList" :requestsList="leftData.requestList"></app-leftside>
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
    import leftside from "../leftside/leftside";
    import {requests} from "../../common/requests";

    export default {
        name: "Main",
        data() {
            return {
                leftData: {},
                activeTab: "friends"
            }
        },
        components: {
            appLeftside: leftside
        },
        methods: {
            getUserInfo() {
                requests.getUserInfo().then(response => {
                    console.log("thenresponse",response)
                    this.leftData = {friendList: response.data.friends, requestList: response.data.requests};
                });
                console.log("leftData",this.leftData)
            },

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
