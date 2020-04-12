<template>
  <div id="login-page">
    <Navbar class="navbar-section"/>
    <div class="row">
      <div class="col">
        <h1>Whoops..</h1>
        <h3>The page you're looking for cannot be found. Please go to the main page.</h3>
      </div>
    </div>
  </div>
</template>

<script>
  import Navbar from "./navbars/Navbar";
  
  export default {
    name: 'PageNotFound',
    components: {
      Navbar
    }
  }
</script>


<style scoped>  
  h1 {
    font-family: Pacifico, sans-serif;
    margin-bottom: 30px;
  }
</style>
