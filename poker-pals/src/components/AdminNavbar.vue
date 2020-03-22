<template>
    <nav>
        <b-navbar toggleable="sm">
            <b-navbar-brand to="reports" class="mx-3">Poker Pals <span class="p-1">admin</span> </b-navbar-brand>
            <b-navbar-nav class="ml-auto mx-3" >
                <b-nav-item to="/" class="b-nav-text">
                    <span class="material-icons"> logout </span>
                </b-nav-item>
            </b-navbar-nav>
        </b-navbar>
    </nav>
</template>

<style scoped>
    @import url('https://fonts.googleapis.com/css?family=Pacifico&display=swap');
    @import url('https://fonts.googleapis.com/icon?family=Material+Icons');
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
    };
</script>