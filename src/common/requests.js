import axios from "axios"
import store from "../store/store";
// export const url = "https://dualchat2.herokuapp.com/";
export const url = "http://localhost:8081/";

export const requests = {
  getUserInfo() {
      return axios.get(url + 'api/getUserInfo', {
      params: {
        userId: store.getters.getUserId.toString()
      },
      headers: {
        'Content-Type': 'application/json',
        'Authorization': store.getters.getToken.toString()

      },
    }).then((response) => {
      return response;
     }).catch(err => {
       throw err;
     })

  },
  acceptRequest(requestOwnerId, reqId) {
    console.log(requestOwnerId);
    let data = {
      myId: store.getters.getUserId.toString(),
      senderId: requestOwnerId.toString(),
      reqId: reqId
    }
    axios.post(url + 'api/acceptRequest', {}, {
        headers: {
          'Authorization': store.getters.getToken.toString(),
          'Content-Type': 'application/json',
        },
        params: data
      }
    ).then((response) => {
      console.log(response.data)
    })
  },
  searchFriend(name){
    return axios.get(url + 'api/getuser', {
      params: {
        username: name
      },
      headers: {
        'Content-Type': 'application/json',
        'Authorization': store.getters.getToken.toString()

      },
    }).then((response) => {
      return response;
    }).catch(err => {
      throw err;
    })
  },
  sendRequest(receiverUserId){
    let data = {
      senderId: store.getters.getUserId.toString(),
      receiverId: receiverUserId.toString(),
    }
    axios.post(url + 'api/sendRequest', {}, {
        headers: {
          'Authorization': store.getters.getToken.toString(),
          'Content-Type': 'application/json',
        },
        params: data
      }
    ).then((response) => {
      console.log(response.data)
    })
  },
  createRoom(roomData){
    let data = {
      roomName : roomData.roomName,
      owner :  localStorage.getItem("fullName"),
      ownerId : localStorage.getItem("userId"),
      maximumMemberCount : roomData.maximumMemberCount
    }

    return axios.post(url + 'api/createRoom',data,
    {
      headers: {
        'Authorization': store.getters.getToken.toString(),
        'Content-Type': 'application/json',
    }
  }).then(response => {
    return response;
  })
  }
}
