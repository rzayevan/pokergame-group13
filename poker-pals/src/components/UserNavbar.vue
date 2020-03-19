<template>
    <div id="navigation-bar">
        <div id="app-logo">
            <p id="app-logo-text">Poker Pals</p>
        </div> 
        <div id="user-info">
            <div id="chip-info">
                <img id="chip-img" src="../assets/chip.png"/>
                <p id="chip-amount">1,200,450</p>
            </div>
            <div id="user-logo">
                <img id="user-img" src="../assets/player_icon_1.png"/>
            </div>
        </div>
    </div>
</template>

<style scoped>
    @import url('https://fonts.googleapis.com/css?family=Pacifico&display=swap');
    #navigation-bar {
        display: flex;
        flex-direction: row;
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
    #user-info {
        display: flex;
        flex-direction: row;
        padding-top: 4px;
        padding-right: 20px;
    }

    #chip-info {
        display: flex;
        flex-direction: row;
        align-items: center;
        padding-right: 50px;
    }

    #chip-amount {
        font-family: 'Roboto';
        color: white;
        font-size: 22px;
        font-style: italic;
    }

    #chip-img {
        width: 30px;
        height: 30px;
    }

    #user-img {
        margin-top: 5px;
        margin-bottom: 5px;
        width: 45px;
        height: 45px;
    }
</style>

<script>
export default {
    name: "UserNavbar",
};
</script>