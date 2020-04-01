<template>
    <div class="clock" :style="{visibility: timer ? 'visible' : 'hidden'}"> <!--when visible an animation starts representing the time the player has left to act-->
        <img src="../../images/clock.png"/>
        <div class="clock_pointer">
            <transition name="rotate"> <!--animation for clock needle-->
                <img v-if="timer" src="../../images/clock_pointer.png"/>
            </transition>
        </div>
    </div>
</template>

<style scoped>
    .clock{
        position: absolute;
        width: 30%;
        height: 58%;
        background: transparent;
        margin: -16% 0% 0% -18%;
    }
    .clock img{
        position: absolute;
        width: 100%;
        height: 100%;
        margin: 0% 0% 0% -50%;
    }                
    .clock_pointer{
        position: absolute;
        width: 100%;
        height: 100%;
        background: transparent;
        margin: 10% 0% 0% 0%;
    }
    .clock_pointer img{
        width: 100%;
        height: 100%;
    }
    .rotate-enter-active{
        animation: rotate 5s;
        animation-timing-function: linear;
    }
    @keyframes rotate {
        0%{
            transform: rotate(0);
        }
        100%{
            transform: rotate(360deg);
        }
    }
</style>

<script>
export default {
    name: "Clock",
    props: [
        'timer',
    ],
}
</script>