<template>
    <div class="full" v-on:click="toggleOptions()" @mouseleave="closeOptions()"> <!--the container of the chat message-->
        <div class="frameA" v-if="!you"> <!--show if this message is not from yourself, includes options to mute or report-->
            <div class="spacer">space</div>
            <div class="name">{{ name }}:</div>
            <div class="message">{{ message }}</div>
            <div class="mute borderRadius" v-if="optionsVisible">
                <div class="innerMute borderRadius">
                    <img src="../../images/mute.png"/>
                </div>
            </div>
            <div class="report borderRadius" v-if="optionsVisible" v-on:click="openReport()">
                <div class="innerReport borderRadius">
                    <img src="../../images/report.png"/>
                </div>
            </div>
            <div class="spacer">space</div>

        </div>
        <div class="frameB" v-if="you"> <!--show if this mesage is from you, no options available-->
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
        cursor: pointer;
    }
    .innerMute{
        float: left;
        width: 90%;
        height: 90%;
        background: white;
        margin: 5% 0% 0% 5%;
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
        cursor: pointer;
    }
    .innerReport{
        float: left;
        width: 90%;
        height: 90%;
        background: white;
        margin: 5% 0% 0% 5%;
    }
    .innerReport img{
        float: left;
        width: 100%;
        height: 100%;
    }
    .borderRadius{
        border-top-right-radius: 20% 20%;
        border-bottom-right-radius: 20% 20%;
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
            optionsVisible: false, // show or hide mute and report options
        }
    },
    methods:{
        toggleOptions(){ // show or hide mute and report options
            this.optionsVisible = !this.optionsVisible;
        },
        closeOptions(){
            this.optionsVisible = false;
        },
        openReport(){ // call back with data about the report
            this.$parent.openReport(this.name, this.messageId);
        }
    }
}
</script>