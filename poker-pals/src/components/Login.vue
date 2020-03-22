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

      <!-- Login Form -->
      <div class="col-md-6">
        <form class="text-left" v-on:submit="loginAction" v-if="showLogin">
          <div class="form-group">
            <label for="email">Email</label>
            <input class="form-control" type="email" id="email" v-model="loginData.loginEmail" required autocomplete="username"/>
          </div>

          <div class="form-group">
            <label for="password1">Password</label>
            <input class="form-control" type="password" id="password1" v-model="loginData.loginPassword" required autocomplete="current-password"/>
          </div>

          <div class="form-group row justify-content-between" v-if="showLogin">
            <a class="col-4" href="#" @click="toggleForm()">Create account</a>
            <input class="col-4 btn" type="submit"  value="Sign In">
          </div>
        </form>

        <!-- Register Form -->
        <form class="text-left" v-on:submit="signUpAction" v-if="!showLogin">
          <div class="form-group">
            <label for="email">Email</label>
            <input class="form-control" type="email" id="email" v-model="signUpData.signUpEmail" required autocomplete="username"/>
          </div>

          <div class="form-group">
            <label  for="username">Username</label>
            <input class="form-control" type="text" id="username" v-model="signUpData.signUpUsername" required autocomplete="username"/>
          </div>

          <div class="form-group">
            <label for="password1">Password</label>
            <input class="form-control" type="password" id="password1" v-model="signUpData.signUpPassword" required autocomplete="current-password"/>
          </div>

          <div class="form-group">
            <label for="password2">Confirm Password</label>
            <input class="form-control" type="password" id="password2" v-model="signUpData.signUpPassword2" required autocomplete="current-password"/>
          </div>

          <div class="form-group row justify-content-between">
            <a class="col-4" href="#" @click="toggleForm()">Sign in</a>
            <input class="col-4 btn" type="submit" value="Sign Up">
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
  import io from "socket.io-client"
  export default {
    name: 'Login',
    data: function() {
      return {
        socket: {},
        showLogin: true,
        loginData: {
          loginEmail: '',
          loginPassword: ''
        },
        signUpData: {
          signUpEmail: '',
          signUpUsername: '',
          signUpPassword: '',
          signUpPassword2: ''
        }
      }
    },
     // gets called before the view is rendered
    created() {
      this.socket = io("http://localhost:3000"); // connect to our server
    },

    // gets called after the view is rendered
    mounted() {
      this.socket.on("connected", data => {
        console.log("client received a message: " + data);
      });

      this.socket.on("authenticated", () => {
        this.$router.push({ name: "Poker" });
      });
    },

    computed: { },
    methods: {
      toggleForm: function() {
        this.showLogin = !this.showLogin;
      },
      loginAction: function (event) {
        event.preventDefault();
        this.socket.emit('authenticate user', {
          email: this.loginData.loginEmail,
          password: this.loginData.loginPassword
        });
        this.loginData = {}; // reset the data
      },
      signUpAction: function(event) {
        event.preventDefault();
        this.socket.emit('add-new-user', {
          email: this.signUpData.signUpEmail,
          username: this.signUpData.signUpUsername,
          password: this.signUpData.signUpPassword,
          confirm_password: this.signUpData.signUpPassword2,
        });
        this.signUpData = {}; // reset the data
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
