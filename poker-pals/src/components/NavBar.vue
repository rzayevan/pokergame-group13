<template>
    <div class="navigationTab">
        <div class="logo">
            <img src="../images/logo.png"/>
        </div>
        <div class="chipIcon">
            <img src="../images/chip.png"/>
        </div>
        <div class="chipValue">1,200,450</div>
        <div class="userIcon">
            <img src="../images/player_icon_1.png" />
        </div>
    </div>
</template>

<style scoped>
    .navigationTab{
        width: 100%;
        height: 7%;
        background: #01B0D9;
    }
    .chipIcon{
        float: left;
        width: 4%;
        height: 80%;
        margin: 0.4% 0% 0% 68%;
    }
    .chipIcon img{
        width: 100%;
        height: 100%;
    }
    .chipValue{
        float: left;
        width: 10%;
        height: 50%;
        margin: 0.5% 0% 0% 0%;
        color: white;
        font-weight: 700;
        font-size: 1.5vw;
    }
    .userIcon{
        float: left;
        width: 4%;
        height: 80%;
        margin: 0.4% 0% 0% 0%;
    }
    .userIcon img{
        width: 100%;
        height: 100%;
    }
    .logo{
        float: left;
        width: 10%;
        height: 100%;
        margin: 0% 0% 0% 2%;
    }
    .logo img{
        width: 100%;
        height: 100%;
    }
    .centerText{
        display : flex;
        align-items : center;
        justify-content: center;
    }
</style>

<script>
export default {
    name: "NavBar",
};
</script>