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
          <div>
            <input type="checkbox" placeholder="username" class="custom-checkbox"> <span
            class="textStyle">Remember me</span>
          </div>
          <div>
            <button type="submit" class="app-button"><span style="font-size: 25px; font-family: 'Courier New';"
                                             v-text="isUser ? 'Sign in' : 'Sign up'">Login</span></button>
          </div>
          <div class="div-holder ">
            <span class="textStyle">Not a member? <u @click="isUser=!isUser"
                                                     style="cursor: pointer">Sign up now</u></span>
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
                user : {
                    username : null,
                    password : null
                }

            }
        },
        methods : {
            onSubmit(){
                this.$store.dispatch("login",{...this.user,isUser : this.isUser})
                    .then((response)=>{
                        this.$router.push("/")
                    })


            }
        }
    }
</script>

<style scoped>

</style>
