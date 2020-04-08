<template>
    <nav>
        <b-navbar toggleable="sm">
            <b-navbar-brand to="tables" class="mx-3">Poker Pals</b-navbar-brand>
            <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>
            <b-collapse id="nav-collapse" is-nav>
                <!-- Right aligned nav items -->
                <b-navbar-nav class="ml-auto mx-3">
                    <b-nav-item class="mx-2">
                        <img class="mr-2 img-fluid" :src="require('../../images/ImageFiles').getImage('chip').src" alt="Poker Chip"/>
                        <span class="b-nav-text">{{userData.chips}}</span>
                    </b-nav-item>
                    <b-nav-item to="profile">
                        <img class="img-fluid" v-bind:src="userData.playerIcon.src" alt="User Profile Image"/>
                    </b-nav-item>
                    <b-nav-item to="/">
                        <b-nav-text class="material-icons"> logout </b-nav-text>
                    </b-nav-item>
                </b-navbar-nav>
            </b-collapse>
        </b-navbar>
    </nav>
</template>

<style scoped>
    nav {
        color: white;
        background-color: #01B0D9;
        padding: 0;
    }

    .navbar-brand {
        font-family: 'Pacifico', sans-serif;
        color: white;
        font-size: 28px;
    }

    .navbar-collapse {
        background-color: #01B0D9;
    }

    .b-nav-text {
        color: white;
    }

    img {
        height: 40px;
    }

    .material-icons{
        color: white;
    }

</style>
<script>
    export default {
        name: "UserNavbar.vue",
        data: function() {
            return {
                userData : {
                    chips: 1200450,
                    playerIcon: require("../../images/ImageFiles").getImage('player_icon_1')
                }
            }
        },
    };
</script>