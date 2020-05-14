<template>
  <div class="container-fluid">
    <div class="row">
      <div class="col-3  " style="height: 100vh">
        <div class="left-side">
          <div class="text-center mt-5">
            <span class="font-custom ">Barancan Yardımcı</span>
          </div>
          <app-leftside :friendsList="leftData.friendList" :requestsList="leftData.requestList"
                        @messageFromChild="call"></app-leftside>

        </div>
      </div>
      <div class="col-9 h-100" style="height: 100vh;">
        <div class="right-side text-center">
          <div>
            <div class="camera-block ">
              <video id="localVideo"  style="background-color: black" autoplay height="250"></video>
            </div>
            <div class="camera-block ">
              <video id="remoteVideo" style="background-color: black" autoplay height="250"></video>
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
                urls: "turn:" + 'localhost:8080',  // A TURN server
                username: "webrtc",
                credential: "turnserver"
            }
        ]

    };
    export default {
        name: "Main",
        data() {
            return {
                leftData: {},
                activeTab: "friends",
                destPeer: null,
                peerConn: null,
                remoteDesc: null,
                destination: null,
                iceCandidate: null,
                callingUsername: null,
                transceiver :null
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

                 const mediaStream = await navigator.mediaDevices.getUserMedia({video: true});
                 var selfVideo = document.getElementById('localVideo');
                 selfVideo.srcObject = mediaStream
                 this.peerConn.addStream(mediaStream);
                 // navigator.mediaDevices.getUserMedia(
                 //    {video: true, audio: false},(stream)=>{
                 //         var selfView = document.getElementById('localVideo');
                 //         selfView.srcObject = stream
                 //         selfView.play();
                 //         console.log("yayin başladı")
                 //         vm.peerConn.addStream(stream);
                 //     });


            },
            handleMessage(msg) {

                console.log(msg);
                var content = JSON.parse(msg);
                if (content.event === "offer") {
                    this.handleCall(content.dest, content.data);
                } else if (content.event === "answer") {
                    this.handleAnswer(content.data);
                } else if (content.event === "candidate") {
                    this.handleCandidate(content.data)
                }
            },
            async call(callingUsername) { // burası teklif yapacak ( offer )
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
            async handleCall(dest, sdp) { // burası cevap oluşturuyor
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
                console.log("answer yakalandi")
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


        },

        created() {
            this.startMyVideo();
            this.$store.dispatch('getUserInfo');
            this.getUserInfo();
            Socket.$on("message", this.handleMessage);
            Socket.$on("close", this.handleMessage);
            this.createPeerConnection();

            // this.startMyVideo()
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
    font-family: "Courier New";

  }

  .normal-font {
    color: white;
    font-size: 20px;

  }

  .camera-block {
    width: 250px;
  }


</style>
