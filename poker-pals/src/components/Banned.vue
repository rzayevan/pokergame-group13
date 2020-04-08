<template>
    <div id="main">
        <Navbar></Navbar>
        <div id="content">
            <span class="material-icons mt-5 mb-3 " id="banned">
                not_interested
            </span>
            <h1>You've been banned.</h1>
            <p>Looks like we’re not poker pals anymore :/ <br>
                Want to talk about it? <a href="javascript:void(0)">contact@pokerpals.ca</a>
            </p>
        </div>
    </div>
</template>

<script>
    import Navbar from "./navbars/Navbar";
    export default {
        name: "Banned.vue",
        components: {
            Navbar
        },
        props: ['authenticated'],
        mounted() {
            if(!this.authenticated){
                this.$router.replace({ name: "Login" }); // send client back to login page
            }
        }
    }
</script>

<style scoped>
    #main {
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        height: 100vh;
    }

    #banned {
        color: #bf214b;
        font-size: 10em;
        font-weight: bold;
    }

    #content {
        flex-grow: 1;
        background-color: #2f252c;
    }

    h1, p {
        color: white;
    }

    a {
        color: #01B0D9;
    }
</style>