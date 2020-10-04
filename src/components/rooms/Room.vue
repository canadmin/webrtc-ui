<template>

<div class="container mt-5">

       <form @submit.prevent="onSubmit">
          <div>
            <p></p>
            <input type="text" placeholder="Room name" class="auth-input" v-model="room.roomName">
          </div>
          <div >
            <p></p>
            <input type="text" placeholder="Maximum member Count" class="auth-input" v-model="room.maximumMember">
          </div>
          <div class="">
            <button type="submit" class="app-button"><span style="font-size: 25px; font-family: 'Courier New';">Create Room</span></button>
          </div>
          <div class="div-holder ">
            <span class="textStyle"><u @click="isUser=!isUser"
                                                     style="cursor: pointer" v-text="isUser?'not yet a member':'already have an account'"></u></span>
          </div>
        </form>
</div>

</template>

<script>
    import {requests} from "../../common/requests";
export default {
     data() {
            return {
                room: {
                    roomName: null,
                    owner: null,
                    maximumMember : null,
                    ownerId : null
                },
               isUser: true,

            }
        },
         methods: {
            onSubmit() {
                let roomInfo;
                   roomInfo = {
                   roomName: this.room.roomName,
                    owner: null,
                    maximumMember : this.room.maximumMember,
                    ownerId : null
                   };
                   console.log(roomInfo)
                   requests.createRoom(roomInfo).then((response) => {
                   let roomInfo = response.data;
                   console.log(response);
                        this.$router.push("/room/"+roomInfo.roomName)
                    });
            }
        }
}
</script>

<style lang="css">
html {
  height: 100%;
}
body {
  min-height: 100%;
}

.info-row{
    margin-top: 25px;
}
</style>