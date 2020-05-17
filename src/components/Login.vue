<template>
  <div class="">
    <div class=" auth-component text-center" v-if="page === 'login'">
      <div class="">
        <p class="titleStyle" v-text="isUser ? 'Sign in' : 'Sign up'">Sing In</p>
      </div>
      <div class="sign-form">
        <form @submit.prevent="onSubmit">
          <div>
            <p></p>
            <input type="text" placeholder="username" class="auth-input" v-model="user.username">
          </div>
          <div>
            <p></p>
            <input type="text" placeholder="password" class="auth-input" v-model="user.password">
          </div>
          <div v-if="!isUser">
            <p></p>
            <input type="text" placeholder="fullname" class="auth-input" v-model="user.fullName">
          </div>
          <div v-if="isUser">
            <input type="checkbox" placeholder="username" class="custom-checkbox"> <span
            class="textStyle">Remember me</span>
          </div>
          <div class="">
            <button type="submit" class="app-button"><span style="font-size: 25px; font-family: 'Courier New';"
                                                           v-text="isUser ? 'Sign in' : 'Sign up'">Login</span></button>
          </div>
          <div class="div-holder ">
            <span class="textStyle"><u @click="isUser=!isUser"
                                                     style="cursor: pointer" v-text="isUser?'not yet a member':'already have an account'"></u></span>
          </div>
        </form>

      </div>
    </div>
  </div>
</template>

<script>
    export default {
        name: 'HelloWorld',
        data() {
            return {
                msg: 'Welcome to Your Vue.js App',
                page: "login",
                isUser: true,
                user: {
                    username: null,
                    password: null,
                    fullName : null
                }

            }
        },
        methods: {
            onSubmit() {
                let nUser;
                if(this.isUser){
                   nUser = {
                       username : this.user.username,
                       password : this.user.password
                   };
                }else{
                    nUser = {
                        username : this.user.username,
                        password : this.user.password,
                        fullName : this.user.fullName
                    }
                }
                console.log(nUser)
                this.$store.dispatch("login", {...nUser, isUser: this.isUser})
                    .then((response) => {
                        this.$router.push("/")
                    })


            }
        }
    }
</script>

<style scoped>

</style>
