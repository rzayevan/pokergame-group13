<template>
  <div id="login-page">
    <Navbar class="navbar-section"/>
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
          <img alt="Poker Pals logo" :src="require('../images/ImageFiles').getImage('logo_card').src">
        </div>

        <div class="col-md-6">
          <!-- Login Form -->
          <form class="text-left" v-on:submit="loginAction" v-if="showLogin">
            <div class="form-group">
              <label for="loginEmail">Email</label>
              <input class="form-control" type="email" id="loginEmail" v-model="loginData.email" required/>
            </div>

            <div class="form-group">
              <label for="loginPassword">Password</label>
              <input class="form-control" type="password" id="loginPassword" v-model="loginData.password" required/>
            </div>

            <div class="form-group row justify-content-between" v-if="showLogin">
              <a class="col-4 button-text" @click="toggleForm()">Create account</a>
              <input class="col-4 btn" type="submit"  value="Sign In">
            </div>
          </form>

          <!-- Register Form -->
          <form class="text-left" v-on:submit="signUpAction" v-if="!showLogin">
            <div class="form-group">
              <label for="signUpEmail">Email</label>
              <input class="form-control" type="email" id="signUpEmail" v-model="signUpData.email" required/>
            </div>

            <div class="form-group">
              <label  for="signUpUsername">Username</label>
              <input class="form-control" type="text" id="signUpUsername" v-model="signUpData.username" required>
            </div>

            <div class="form-group">
              <label for="signUpPassword">Password</label>
              <input class="form-control" type="password" id="signUpPassword" v-model="signUpData.password" required/>
            </div>

            <div class="form-group">
              <label for="signUpConfirmPassword">Confirm Password</label>
              <input class="form-control" type="password" id="signUpConfirmPassword" v-model="signUpData.confirm_password" required/>
            </div>

            <div class="form-group row justify-content-between">
              <a class="col-4 button-text" @click="toggleForm()">Sign in</a>
              <input class="col-4 btn" type="submit" value="Sign Up">
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import Navbar from "./navbars/Navbar";
  import io from "socket.io-client";
  
  export default {
    name: 'Login',
    components: {
      Navbar
    },
    data: function() {
      return {
        socket: {},
        showLogin: true,
        loginData: {
          email: '',
          password: ''
        },
        signUpData: {
          email: '',
          username: '',
          password: '',
          confirm_password: ''
        }
      }
    },
     // gets called before the view is rendered
    created() {
      this.socket = io("http://localhost:3000"); // connect to our server
    },

    // Add client side listeners
    mounted() {
      this.socket.on("connected", data => {
        console.log("client received a message: " + data);
      });

      // Navigate to tables page if authentication was successful
      this.socket.on("authenticatedUser", userID => {
        this.$router.replace({ name: "Tables", params: {authenticated: true, socket: this.socket, userID: userID}});
      });

      // Navigate to reports page if authentication was successful
      this.socket.on("authenticatedAdmin", userID => {
        this.$router.replace({ name: "Reports", params: {authenticated: true, socket: this.socket, userID: userID}});
      });

      this.socket.on("banned", () => {
        this.$router.replace({ name: "Banned", params: {authenticated: true}});
      });

      // display error message sent from server
      this.socket.on("alert text", alertText => {
        alert(alertText);
      });
    },

    computed: { },
    methods: {
      // a toggle to switch between login and sign up views
      toggleForm: function() {
        this.showLogin = !this.showLogin;
      },

      // gets triggered when the login form is submitted
      loginAction: function (event) {
        event.preventDefault(); // prevent page reload
        
        // send a request to the server
        this.socket.emit('authenticate user', {
          email: this.loginData.email,
          password: this.loginData.password
        });

        this.loginData = {}; // reset the data
      },

      // gets triggered when the sign up form is submitted
      signUpAction: function(event) {
        event.preventDefault(); // prevent page reload

        // check if the password and confirm password fields match
        if (this.signUpData.password === this.signUpData.confirm_password) {
          // send a request to the server with user information
          this.socket.emit('add-new-user', {
            email: this.signUpData.email,
            username: this.signUpData.username,
            password: this.signUpData.password,
          });
        } else {
          alert("Passwords don't match. Please try again.");
        }
        
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

  .button-text {
    color: #01B0D9;
  }

 
</style>
