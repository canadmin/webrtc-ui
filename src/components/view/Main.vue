<template>
  <div class="container-fluid">
    <div class="row">
      <div class="col-3  " style="height: 100vh">
        <div class="left-side">
          <div class="text-center mt-5">
            <button class="mt-1" @click="cikisYap()">Çıkış Yap</button>
            <br>
            <span class="font-custom ">{{fullName}}</span>
          </div>
          <app-leftside :friendsList="leftData.friendList" :requestsList="leftData.requestList"
                        @messageFromChild="call"></app-leftside>

        </div>
      </div>
      <div class="col-9 h-100" style="height: 100vh;">
        <div class="right-side text-center">

          <div class="w-50 ml-auto mr-auto caller " v-show="isAvailableCaller">
            <div class=" mt-5 d-inline">
              <img src="../../assets/answer.png" width="100" class="mt-5" @click="handleCall()">
              <img src="../../assets/decline.png" width="100" class="ml-5 mt-5">
              <div>
                <p class="bg-white mt-5">Arıyor</p>
              </div>
            </div>
          </div>


          <div class="in-chat" v-show="isCallActive">
            <div class="camera-block d-inline ">
              <video id="localVideo"  class="mt-5 mr-5" style="background-color: black" autoplay height="250"></video>
              <video id="remoteVideo"  class="mt-5 ml-5"style="background-color: black" autoplay height="250"></video>
            </div>
            <div class="d-inline">
              <div class="chat-action-button">
                <img src="../../assets/chatCam.png" width="100" class="">
                <img src="../../assets/chatVoice.png" width="100" class="ml-5">
                <img src="../../assets/chatcancel.png" class="chat-icon ml-5">
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
    import axios from 'axios';
    import leftside from "../leftside/leftside";
    import {requests} from "../../common/requests";
    import Socket from "../../common/socket"

    let localStream;
    const configuration = {
        iceServers: [
            {
                urls: 'turn:numb.viagenie.ca',  // A TURN server
                username: "muazkh",
                credential: "webrtc@live.com"
            }
        ]

    };
    export default {
        name: "Main",
        data() {
            return {
                fullName : null,
                leftData: {},
                activeTab: "friends",
                destPeer: null,
                peerConn: null,
                remoteDesc: null,
                destination: null,
                destinationData : null,
                iceCandidate: null,
                callingUsername: null,
                transceiver :null,
                selfStream : null,
                isCallActive : false,
                isAvailableCaller : false,

            }
        },
        components: {
            appLeftside: leftside
        },
        methods: {
            getUserInfo() {
                requests.getUserInfo().then(response => {
                    this.leftData = {friendList: response.data.friends, requestList: response.data.requests};
                });
                console.log("leftData", this.leftData)
            },
             async startMyVideo() {
                var vm = this;
                 console.log("start video")
                 this.selfStream = await navigator.mediaDevices.getUserMedia({video: true , audio :true});
                 this.peerConn.addStream(this.selfStream);
            },
            handleMessage(msg) {
                console.log(msg);
                var content = JSON.parse(msg);
                if (content.event === "offer") {
                    this.isAvailableCaller = true;
                    this.destination = content.dest;
                    this.destinationData = content.data;
                    // this.handleCall(content.dest, content.data);
                } else if (content.event === "answer") {
                    this.handleAnswer(content.data);
                } else if (content.event === "candidate") {
                    this.handleCandidate(content.data)
                }
            },
            async call(callingUsername) { // burası teklif yapacak ( offer )
                this.isCallActive = true;
                var selfVideo = document.getElementById('localVideo');
                selfVideo.srcObject = this.selfStream;
                this.callingUsername = callingUsername;
                var vm = this;
                const offer = await this.peerConn.createOffer();

                if (this.peerConn.signalingState !== "stable") {
                    return;
                }
                await this.peerConn.setLocalDescription(offer);

                Socket.send({
                    event: "offer",
                    dest: callingUsername,
                    data: this.peerConn.localDescription
                })
            },
            async handleCall() { // burası cevap oluşturuyor
                this.isAvailableCaller = false;
                this.isCallActive = true;
                var dest, sdp;
                dest = this.destination;
                sdp = this.destinationData;
                this.isCallActive = true;
                var selfVideo = document.getElementById('localVideo');
                selfVideo.srcObject = this.selfStream;
                var desc = new RTCSessionDescription(sdp);
                if(this.peerConn.signalingState !== "stable"){
                    await Promise.all([
                        this.peerConn.setLocalDescription({type: "rollback"}),
                        this.peerConn.setRemoteDescription(desc)
                    ]);
                }else{
                    await this.peerConn.setRemoteDescription(desc);
                }
                await this.peerConn.setLocalDescription(await this.peerConn.createAnswer());
                Socket.send({
                    event: "answer",
                    dest: dest,
                    data: this.peerConn.localDescription
                });

            },
            async handleAnswer(answer) {
                var desc = new RTCSessionDescription(answer);
                await this.peerConn.setRemoteDescription(desc);

            },

           async handleCandidate(candidate) {

               var ncandidate = new RTCIceCandidate(candidate);
                try {
                    await this.peerConn.addIceCandidate(ncandidate)
                } catch(err) {
                    console.log(err)
                }
            },
            createPeerConnection() {
                console.log("peer connection kurulumu")
                this.peerConn = new RTCPeerConnection(configuration);
                  this.peerConn.onaddstream = e => {
                      console.log("ontrack calisti")
                      var video = document.getElementById("remoteVideo");
                      video.srcObject = e.stream;
                  };
                var vm = this;
                this.peerConn.onicecandidate = (evt) => {
                    if (evt.candidate)
                        Socket.send({
                            event: 'candidate',
                            dest: vm.callingUsername,
                            data: evt.candidate
                        })
                }

            },
            cikisYap(){
                localStorage.removeItem('fullName');
                localStorage.removeItem('token');
                localStorage.removeItem('username');
                localStorage.removeItem('userId');
                this.$router.push("/auth")


            }


        },

        created() {
            this.startMyVideo()
            this.$store.dispatch('getUserInfo');
            this.getUserInfo();
            Socket.$on("message", this.handleMessage);
            Socket.$on("close", this.handleMessage);
            this.createPeerConnection();
            this.fullName = localStorage.getItem("fullName")
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
    height: 800px;
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
    height: 800px;
    border-radius: 10px;

    position: relative;
  }

  .font-custom {
    font-size: 40px;
    color: white;
    font-family: "Courier New";

  }

  .normal-font {
    color: white;
    font-size: 20px;

  }
  .chat-icon{
    width: 120px;
    height: 120px;
  }

  video {
    width: 40%;
    height: 40vh;
  }
  .chat-action-button{
    width: 70%;
    margin-left: auto;
    margin-right: auto;
    margin-top: 10%;
    background-color: #717171;
    border-radius: 20px;
    -webkit-box-shadow: 1px 0px 43px 0px rgba(0, 0, 0, 0.75);
    -moz-box-shadow: 1px 0px 43px 0px rgba(0, 0, 0, 0.75);
    box-shadow: 1px 0px 43px 0px rgba(0, 0, 0, 0.75);
  }
  .caller{
    -webkit-box-shadow: 1px 0px 43px 0px rgba(0, 0, 0, 0.75);
    -moz-box-shadow: 1px 0px 43px 0px rgba(0, 0, 0, 0.75);
    box-shadow: 1px 0px 43px 0px rgba(0, 0, 0, 0.75);
  }

</style>
