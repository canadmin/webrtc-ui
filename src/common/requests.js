import axios from "axios"
import store from "../store/store";

export const requests = {
  getUserInfo() {
      return axios.get('http://18.196.21.191/api/getUserInfo', {
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
    axios.post('http://18.196.21.191/api/acceptRequest', {}, {
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
    return axios.get('http://18.196.21.191/api/getuser', {
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
    axios.post('http://18.196.21.191/api/sendRequest', {}, {
        headers: {
          'Authorization': store.getters.getToken.toString(),
          'Content-Type': 'application/json',
        },
        params: data
      }
    ).then((response) => {
      console.log(response.data)
    })
  }
}
