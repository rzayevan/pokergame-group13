<template>
    <div id="navigation-bar">
        <div id="app-logo">
            <p id="app-logo-text">Poker Pals</p>
        </div> 
        <div class="chip-logo">
            <img src="../assets/logo.png"/>
        </div>
        <div class="chip-amount">1,200,450</div>
        <div class="userIcon">
            <img src="../assets/logo.png"/>
        </div>
    </div>
</template>

<style scoped>
    @import url('https://fonts.googleapis.com/css?family=Pacifico&display=swap');
    #navigation-bar {
        width: 100%;
        height: 8%;
        background-color: #01B0D9;
    }
    #app-logo {
        width: 100%;
        height: 100%;
        float: left;
    }
    #app-logo-text {
        font-family: 'Pacifico', cursive;
        color: white;
        font-size: 28px;
        float: left;
        padding-top: 5px;
        padding-left: 30px;
    }
</style>

<script>
export default {
    name: "UserNavbar",
};
</script>