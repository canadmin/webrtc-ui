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
              <video id="localVideo" autoplay height="250"></video>
            </div>
            <div class="camera-block ">
              <video id="remoteVideo" autoplay height="250"></video>
            </div>

            <textarea></textarea>
            <div>Kabul Et</div>
            <div></div>
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

    const configuration = {
        iceServers: [{'urls': 'stun:stun4.l.google.com:19302'}],
    };
    export default {
        name: "Main",
        data() {
            return {
                leftData: {},
                activeTab: "friends",
                destPeer: null,
                peerConn: null,
                callingUsername: null
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
            startMyVideo() {
                navigator.getUserMedia({
                    'audio': true,
                    'video': true
                }, function (stream) {
                    var selfView = document.getElementById('localVideo');
                    selfView.srcObject = stream;
                    selfView.play();
                });
            },
            handleMessage(msg) {
                console.log(msg);
                var content = JSON.parse(msg);
                if (content.event === "offer") {
                    this.handleCall(content.dest, content.data);
                } else if(content.event === "answer"){
                    this.handleAnswer(content.data);
                }else if(content.event === "candidate"){
                   this.handleCandidate(content.event)
                }
            },
            call(callingUsername) { // burası teklif yapacak ( offer )
                this.callingUsername = callingUsername;
                var vm = this;
                this.peerConn.createOffer((offer) => {
                     vm.peerConn.setLocalDescription(offer);
                }).then(() => {
                    Socket.send({
                        event: "offer",
                        dest: callingUsername,
                        data: vm.peerConn.localDescription
                    })
                }).catch(reason => {
                    throw reason;
                })
                this.startMyVideo();
            },
            handleCall(dest, sdp) { // burası cevap oluşturuyor
                this.peerConn.setRemoteDescription(new RTCSessionDescription(sdp))
                var vm = this;
                this.peerConn.createAnswer()
                    .then((answer) => {
                        vm.peerConn.setLocalDescription(answer)
                            .then((data) => {
                            Socket.send({
                                event: "answer",
                                dest: dest,
                                data: vm.peerConn.localDescription
                            })
                        })
                    })
            },
            handleAnswer(answer){
            //    this.peerConn.setRemoteDescription(answer);
            },
            handleCandidate(candidate) {
              //  this.peerConn.addIceCandidate(candidate);
            },
            createPeerConnection() {
                console.log("peer connection kurulumu")
                this.peerConn = new RTCPeerConnection(configuration);
                var vm = this;
                this.peerConn.onicecandidate = (evt) => {
                    if (evt.candidate)
                        Socket.send({
                            event: 'candidate',
                            dest: vm.callingUsername,
                            data: evt.candidate
                        })
                }

            }

        },

        created() {
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
