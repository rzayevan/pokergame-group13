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
            <input class="form-control" type="email" id="loginEmail" v-model="loginData.email" required/>
          </div>

          <div class="form-group">
            <label for="password1">Password</label>
            <input class="form-control" type="password" id="loginPassword" v-model="loginData.password" required/>
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
            <input class="form-control" type="email" id="signUpEmail" v-model="signUpData.email" required/>
          </div>

          <div class="form-group">
            <label  for="username">Username</label>
            <input class="form-control" type="text" id="signUpUsername" v-model="signUpData.username" required>
          </div>

          <div class="form-group">
            <label for="password1">Password</label>
            <input class="form-control" type="password" id="signUpPassword" v-model="signUpData.password" required/>
          </div>

          <div class="form-group">
            <label for="password2">Confirm Password</label>
            <input class="form-control" type="password" id="signUpPassword2" v-model="signUpData.confirm_password" required/>
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
          email: this.loginData.email,
          password: this.loginData.password
        });
        this.loginData = {}; // reset the data
      },
      signUpAction: function(event) {
        event.preventDefault();
        this.socket.emit('add-new-user', {
          email: this.signUpData.email,
          username: this.signUpData.username,
          password: this.signUpData.password,
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
