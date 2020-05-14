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
        iceServers: [     // Information about ICE servers - Use your own!
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
                iceCandidate : null,
                callingUsername : null
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
                const gumStream = await navigator.mediaDevices.getUserMedia(
                    {video: true, audio: false});
                for (const track of gumStream.getTracks()) {
                    var selfView = document.getElementById('localVideo');
                    selfView.srcObject = gumStream;
                    localStream = gumStream;
                    vm.peerConn.addTrack(track);
                }
                // navigator.getUserMedia({
                //     'audio': false,
                //     'video': true
                // }, function (stream) {
                //
                //     vm.peerConn.addStream(stream)
                //     selfView.play();
                // });
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
            call(callingUsername) { // burası teklif yapacak ( offer )
                this.callingUsername = callingUsername;
                var vm = this;
                this.peerConn.createOffer((offer) => {
                    return vm.peerConn.setLocalDescription(offer);
                }).then((data) => {
                    Socket.send({
                        event: "offer",
                        dest: callingUsername,
                        data: data
                    })
                }).catch(reason => {
                    throw reason;
                })
                console.log("peercon 1",this.peerConn)
            },
            handleCall(dest,sdp) { // burası cevap oluşturuyor
                this.peerConn.setRemoteDescription(new RTCSessionDescription(sdp));
                var vm = this;
                this.peerConn.createAnswer().then(function (answer) {
                     vm.peerConn.setLocalDescription(answer);
                }).then(() => {
                    Socket.send({
                        event: "answer",
                        dest: dest,
                        data: vm.peerConn.localDescription
                    });
                })
                console.log("peercon 2",this.peerConn)

            },
            handleAnswer(answer) {
                console.log("peercon 3",this.peerConn)

                this.peerConn.setRemoteDescription(new RTCSessionDescription(answer));
            },

            handleCandidate(candidate) {
                this.peerConn.addIceCandidate(new RTCIceCandidate(candidate));
            },
            createPeerConnection() {
                console.log("peer connection kurulumu")
                this.peerConn = new RTCPeerConnection(configuration);
                this.peerConn.addtrack = e => {
                    var video = document.getElementById("remoteVideo");
                    video.srcObject = e.stream;
                };
                var vm = this;
                this.peerConn.onicecandidate = (evt) => {
                    console.log("icecalisti")
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
