<template>
    <nav>
        <b-navbar toggleable="sm">
            <b-navbar-brand class="mx-3" @click="navigateToTables()">Poker Pals</b-navbar-brand>
            <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>
            <b-collapse id="nav-collapse" is-nav>
                <!-- Right aligned nav items -->
                <b-navbar-nav class="ml-auto mx-3">
                    <b-nav-item class="mx-2" disabled>
                        <img class="mr-2 img-fluid" :src="require('../../images/ImageFiles').getImage('chip').src" alt="Poker Chip"/>
                        <span class="b-nav-text">{{user.chips}}</span>
                    </b-nav-item>
                    <b-nav-item disabled>
                        <img class="img-fluid" v-bind:src="playerIcon.src" alt="User Profile Image"/>
                        <span class="b-nav-name">{{user.username}}</span>
                    </b-nav-item>
                    <b-nav-item v-if="!hideLogOut" to="/">
                        <b-nav-text class="material-icons" @click="logOut()"> logout </b-nav-text>
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
        cursor: pointer;
    }

    .navbar-collapse {
        background-color: #01B0D9;
    }

    .b-nav-text {
        color: white;
    }

    .b-nav-name {
        color: white;
        padding:5px; 
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
        props: ['socket', 'userData', 'hideLogOut'],
        methods: {
            navigateToTables: function() {
                this.$router.replace({ name: "Tables", params: {authenticated: true, socket: this.socket, userData: this.userData} }).catch(err => {
                    if (err.name !== "NavigationDuplicated") throw err;
                });
                this.socket.emit('diconnect from table');
            },
            logOut: function() {
                this.socket.emit('log out user', this.userData);
            }
        },
        data() {
            return {
                user: {},
                playerIcon: require("../../images/ImageFiles").getImage('invisible'),
            }
        },
        mounted() {
            this.playerIcon = require("../../images/ImageFiles").getImage(this.userData.icon);
            this.user = this.userData;
        }
    };
</script>