<template>
    <div class="container">
        <div class="row">
            <div class="col">
                <h1>Poker Pals</h1>
                <h3>Play poker with your pals</h3>
            </div>
        </div>

        <div class="row align-items-center">

            <div class="col-md-6 offset-md-0 col-6 offset-3 ">
                <img alt="Poker Pals logo" src="../assets/logo.svg">
            </div>

            <div class="col-md-6">
                <form class="text-left">
                    <div class="form-group">

                        <label for="email">Email</label>
                        <input class="form-control" type="email" id="email" v-model="email" required="required">
                    </div>
                    <div class="form-group">

                        <label for="username">Username</label>
                        <input class="form-control" type="text" id="username" v-model="username" required="required">
                    </div>
                    <div class="form-group">

                        <label for="password1">Password</label>
                        <input class="form-control" type="password" id="password1" v-model="password" required="required">
                    </div>
                    <div class="form-group">

                        <label for="password2">Confirm Password</label>
                        <input class="form-control" type="password" id="password2" v-model="password2" required="required"/>
                    </div>

                    <div class="form-group row justify-content-between">
                        <a class="col-4" href="/Login">Login</a>
                        <input class="col-4 btn" type="submit"  value="Submit">
                    </div>

                </form>
            </div>
        </div>
    </div>
</template>


<script>
    export default {
        name: 'Register',
        data: function() {
            return {
                email: '',
                username: '',
                password: '',
                password2: ''
            }
        },
        computed: { },
        methods: { }
    }
</script>



<style scoped>
    img {
        width: 100%;
        max-width: 400px;
    }

    h1 {
        font-family: Pacifico, sans-serif;
    }

    form {
        padding: 2em;
    }

    .btn {
        background-color: #01B0D9;
        color: white;
    }

    @media (max-width: 768px) {

    }
</style>
