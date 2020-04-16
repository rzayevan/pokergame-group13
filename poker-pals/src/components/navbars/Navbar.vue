<template>
    <nav>
        <b-navbar>
            <b-navbar-brand to="/login" class="mx-3" id="brand">Poker Pals</b-navbar-brand>
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
</style>
<script>
    export default {
        name: "Navbar.vue",
    };
</script>