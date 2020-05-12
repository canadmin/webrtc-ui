<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App',
    created() {
      this.$store.dispatch('initAuth')
    }
}
</script>

<style>
  html, body {
    height: 100%;
  }
  .auth-component {
    background-color: #2c3e50;
    margin: auto;
    height: 60vh;
    width: 30%;
    margin-top: 150px;
    padding: 10px;
    position: relative;
    -webkit-box-shadow: 1px 0px 43px 0px rgba(0, 0, 0, 0.75);
    -moz-box-shadow: 1px 0px 43px 0px rgba(0, 0, 0, 0.75);
    box-shadow: 1px 0px 43px 0px rgba(0, 0, 0, 0.75);
    border-radius: 10px;
  }

  .sign-form {

  }

  .titleStyle {
    color: #f5f5f5;
    font-size: 45px;
    font-family: "Courier New";
  }

  .textStyle {
    color: #f5f5f5;
    font-size: 23px;
    font-family: "Courier New";
  }

  .auth-input {
    border-radius: 5px;
    border: 0;
    box-shadow: 0 0 0 1px rgba(0, 0, 0, .15), 0 2px 3px rgba(0, 0, 0, .2);
    background-color: #f5f5f5;
    height: 50px;
    padding-left: 10px;
    width: 70%;
  }

  .app-button {
    width: 70%;
    border-radius: 5px;
    border: 0;
      color: #2c3e50;
    box-shadow: 0 0 0 1px rgba(0, 0, 0, .15), 0 2px 3px rgba(0, 0, 0, .2);
    background-color: #f5f5f5;
    height: 50px;
    padding-left: 10px;
  }

  .app-button:hover {
    background-color: #504945;
    color: white;
  }

  .div-holder {
    width: 100%;
    height: 50px;
    bottom: 0;
    position: absolute;
    margin-left: auto;
    margin-right: auto;

  }
</style>
