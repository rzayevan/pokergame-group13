<template>
    <nav>
        <b-navbar toggleable="sm">
            <b-navbar-brand href="#" class="mx-3">Poker Pals</b-navbar-brand>
            <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>
            <b-collapse id="nav-collapse" is-nav>
                <!-- Right aligned nav items -->
                <b-navbar-nav class="ml-auto mx-3">
                    <b-nav-item to="profile" class="mx-2">
                        <img class="mr-2 img-fluid" src="../assets/chip.png" alt="Poker Chip"/>
                        <span class="b-nav-text">1,200,450</span>
                    </b-nav-item>
                    <b-nav-item to="profile">
                        <img class="img-fluid" src="../assets/player_icon_1.png" alt="User Profile Image"/>
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

</style>

<script>
    export default {
        name: "UserNavbar.vue",
    };
</script>