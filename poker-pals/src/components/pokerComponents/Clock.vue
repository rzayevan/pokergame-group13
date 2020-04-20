<template>
    <div class="clock" :style="{visibility: timer ? 'visible' : 'hidden'}"> <!--when visible an animation starts representing the time the player has left to act-->
        <img :src="require('../../images/ImageFiles').getImage('clock').src"/>
        <div class="clock_pointer">
            <transition name="rotate"> <!--animation for clock needle-->
                <img v-if="timer" :src="require('../../images/ImageFiles').getImage('clock_pointer').src"/>
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
    }
    .clock img{
        position: absolute;
        width: 100%;
        height: 100%;
    }
    .clock_pointer{
        position: absolute;
        width: 100%;
        height: 100%;
        background: transparent;
    }
    .clock_pointer img{
        width: 100%;
        height: 100%;
    }
    .rotate-enter-active{
        animation: rotate 20s;
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
        'timer', 'timerReset',
    ],
    watch: {
        timerReset: function(){
            // TODO: reset the animation, if the turn does not change after card reveal (dealer), 
            // then the animation never gets the cue to reset
        }
    }
}
</script>