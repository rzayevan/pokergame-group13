<template>
  <div v-cloak class="container">
    <div class="row">
      <div class="col">
        <h1>Poker Pals</h1>
        <h3>Play poker with your pals</h3>
      </div>
    </div>

    <div class="row align-items-center">
      <!--  Poker Pals Logo  -->
      <div class="col-md-6 offset-md-0 col-6 offset-3 ">
        <img alt="Poker Pals logo" src="../assets/logo.svg">
      </div>

      <!--  Login/Register Form -->
      <div class="col-md-6">
        <form class="text-left">
          <div class="form-group">
            <label for="email">Email</label>
            <input class="form-control" type="email" id="email" v-model="email" required autocomplete="username"/>
          </div>

          <div class="form-group" v-if="!showLogin">
            <label  for="username">Username</label>
            <input class="form-control" type="text" id="username" v-model="username" required autocomplete="username"/>
          </div>

          <div class="form-group">
            <label for="password1">Password</label>
            <input class="form-control" type="password" id="password1" v-model="password" required autocomplete="current-password"/>
          </div>

          <div class="form-group" v-if="!showLogin">
            <label for="password2">Confirm Password</label>
            <input class="form-control" type="password" id="password2" v-model="password2" required autocomplete="current-password"/>
          </div>

          <div class="form-group row justify-content-between" v-if="showLogin">
            <a class="col-4" href="#" @click="toggleForm()">Create account</a>
            <input class="col-4 btn" type="submit"  value="Sign In">
          </div>

          <div class="form-group row justify-content-between" v-if="!showLogin">
            <a class="col-4" href="#" @click="toggleForm()">Sign in</a>
            <input class="col-4 btn" type="submit"  value="Sign Up">
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'Login',
    data: function() {
      return {
        email: '',
        username: '',
        password: '',
        password2: '',
        showLogin: true
      }
    },
    computed: { },
    methods: {
      toggleForm: function() {
        this.showLogin = !this.showLogin;
      }
    }
  }
</script>


<style scoped>  
  [v-cloak] {
    display: none;
  }

  img {
    width: 100%;
    max-width: 400px;
  }

  h1 {
    font-family: Pacifico, sans-serif;
  }

  form {
    margin: auto;
  }

  .btn {
    background-color: #01B0D9;
    color: white;
  }
</style>
