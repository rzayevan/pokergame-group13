<template>
    <div class="full" v-on:click="toggleOptions()" @mouseleave="closeOptions()">
        <div class="frameA" v-if="!you">
            <div class="spacer">space</div>
            <div class="name">{{ name }}:</div>
            <div class="message">{{ message }}</div>
            <div class="mute" v-if="optionsVisible">
                <div class="innerMute">
                    <img src="../../images/mute.png"/>
                </div>
            </div>
            <div class="report" v-if="optionsVisible" v-on:click="openReport()">
                <div class="innerReport">
                    <img src="../../images/report.png"/>
                </div>
            </div>
            <div class="spacer">space</div>

        </div>
        <div class="frameB" v-if="you">
            <div class="spacer">space</div>
            <div class="message color">{{ message }}</div>
            <div class="spacer">space</div>
        </div>
    </div>
</template>

<style scoped>
    .full{
        float: left;
        width: 100%;
        height: 10%;
    }
    .frameA{
        float: left;
        width: auto;
        min-width: 20%;
        max-width: 70%;
        background: white;
        border-radius: 0.8vw/0.8vw;
        margin: 0% 0% 0% 5%;
    }
    .frameB{
        float: right;
        width: auto;
        min-width: 20%;
        max-width: 70%;
        background:#01B0D9;
        border-radius: 0.8vw/0.8vw;
        margin: 0% 5% 0% 0%;
    }
    .name{
        width: 50%;
        height: 50%;
        text-align: left;
        margin: 0% 0% 0% 0.5vw;
        font-size: 1vw;
    }
    .message{
        float: left;
        width: 90%;
        text-align: left;
        margin: 0% 0% 0% 0.5vw;
        font-size: 1vw;
    }
    .spacer{
        float: left;
        width: 100%;
        color: transparent;
        font-size: 0.25vw;
    }
    .color{
        color: white;
    }
    .mute{
        float: left;
        width: 2vw;
        height: 2vw;
        background: black;
        margin: -2.5vw 0% 0% 97%;
        border-top-left-radius: 20% 20%;
        border-bottom-left-radius: 20% 20%;
        cursor: pointer;
    }
    .innerMute{
        float: left;
        width: 90%;
        height: 90%;
        background: white;
        margin: 5% 0% 0% 5%;
        border-top-left-radius: 20% 20%;
        border-bottom-left-radius: 20% 20%;
    }
    .innerMute img{
        float: left;
        width: 100%;
        height: 100%;
    }
    .report{
        float: left;
        width: 2vw;
        height: 2vw;
        background: black;
        margin: -2.5vw 0% 0% 109.25%;
        border-top-right-radius: 20% 20%;
        border-bottom-right-radius: 20% 20%;
        cursor: pointer;
    }
    .innerReport{
        float: left;
        width: 90%;
        height: 90%;
        background: white;
        margin: 5% 0% 0% 5%;
        border-top-right-radius: 20% 20%;
        border-bottom-right-radius: 20% 20%;
    }
    .innerReport img{
        float: left;
        width: 100%;
        height: 100%;
    }


</style>

<script>
export default {
    name: "ChatMessage",
    props: [
        'you', 'name','message', 'messageId',
    ],
    data() {
        return {
            optionsVisible: false,
        }
    },
    mounted(){
        
    },
    watch: {
        
    },
    methods:{
        toggleOptions(){
            this.optionsVisible = !this.optionsVisible;
        },
        closeOptions(){
            this.optionsVisible = false;
        },
        openReport(){
            // call back with some data
            this.$parent.openReport(this.name, this.messageId);
        }
    }
}
</script>