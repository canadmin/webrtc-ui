<template>
  <div class="container-fluid">
    <div class="row">
      <div class="col-3  " style="height: 100vh">
        <div class="left-side">
          <div class="text-center mt-5">
            <span class="font-custom ">Barancan Yardımcı</span>
          </div>
          <div class="text-center">
            <span class="normal-font">Friends List</span>
          </div>
          <div class="friendsList text-center">

            <div class="friend" v-for="v in 10">
              <span class="normal-font">YusufAli Çezik</span>
              <img src="../../assets/camera.png" class="cam">
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

    export default {
        name: "Main",
        data() {
            return {
                friendList: []
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
                    console.log(response)
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
    width: 90%;
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
