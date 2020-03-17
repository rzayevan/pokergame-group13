<template>
  <div class="container">
    <div class="row">
      <div class="col">
        <h1>Poker Pals</h1>
        <h3>Play poker with your pals</h3>
      </div>
    </div>

    <div class="row align-items-center">

      <div class="col-md-6 offset-md-0 col-6 offset-3 ">
        <img alt="Poker Pals logo" src="../assets/logo.svg">
      </div>

      <div class="col-md-6">
        <form class="text-left">
          <h4>Sign into Poker Pals</h4>
          <div class="form-group">
            <label for="email">Email</label>
            <input type="email" id="email"  class="form-control" v-model="email" required="required">
          </div>

          <div class="form-group">
            <label for="password">Password</label>
            <input type="password" id="password" class="form-control"  v-model="password" required="required">
          </div>

          <div class="form-group row justify-content-between">
            <a href="/#/Register" class="col-4" >Create an Account</a>
            <input type="submit" class="btn col-4" value="Submit">
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
        password: '',
        login: true
      }
    },
    computed: { },
    methods: { }
  }
</script>


<style scoped>
  img {
    width: 100%;
    max-width: 400px;
  }

  h1 {
    font-family: Pacifico, sans-serif;
  }

  form {
    padding: 2em;
  }

  .btn {
    background-color: #01B0D9;
    color: white;
  }

  @media (max-width: 768px) {

  }

</style>
