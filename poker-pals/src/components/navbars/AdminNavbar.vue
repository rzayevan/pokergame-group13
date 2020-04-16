<template>
    <nav>
        <b-navbar toggleable="sm">
            <b-navbar-brand class="mx-3" id="brand" > Poker Pals <span class="p-1">admin</span> </b-navbar-brand>
            <b-navbar-nav class="ml-auto mx-3">
                <b-nav-item to="/">
                    <b-nav-text class="material-icons" @click="logOut()"> logout </b-nav-text>
                </b-nav-item>
            </b-navbar-nav>
        </b-navbar>
    </nav>
</template>

<style scoped>
    nav {
        color: white;
        background-color: #01B0D9;
        padding: 0;
    }

    #brand {
        font-family: 'Pacifico', sans-serif;
        color: white;
        font-size: 28px;
    }

    #brand:hover {
        cursor: default;
        color: white;
    }

    .navbar-brand span {
        background-color: #bf214b;
        font-family: 'Roboto', sans-serif;
        font-size: 16px;
    }

    .material-icons {
        color: white;
    }

</style>

<script>
    export default {
        name: "AdminNavbar.vue",
        props: ['socket', 'userData'],
        methods: {
            logOut: function() {
                this.socket.emit('log out user', this.userData);
            }
        }
    };
</script>