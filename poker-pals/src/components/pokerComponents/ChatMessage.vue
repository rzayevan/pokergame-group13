<template>
    <!-- Display a received message. -->
    <b-col v-if="!you" class="col-8 text-left my-1 ml-1 ">
        <div class=" message received">
            <p class="text-left m-1 ">
                <b>{{name}}</b><br>
                {{message}}
            </p>
            <div class="mute borderRadius" v-if="optionsVisible">
                <div class="innerMute borderRadius">
                    <img src="../../images/mute.png"/>
                </div>
            </div>
            <div class="report borderRadius" v-if="optionsVisible" v-on:click="openReport()">
                <div class="innerReport borderRadius"> dw
                    <img src="../../images/report.png"/>
                </div>
            </div>
        </div>
    </b-col>

    <!--  Display a sent message.  -->
    <b-col v-else class="col-8 my-1" offset="4" >
        <div class="message sent" >{{ message }}</div>
    </b-col>
</template>

<style scoped>
    .message{
        text-align: left;
        display: inline-block;
        max-width: 100%;
        border-radius: 1em;
        padding: 6px 10px;
    }

    .sent {
        float: right;
        color: white;
        background-color: #01B0D9;
        border-bottom-right-radius: 0;
    }

    .received {
        background-color: #F2F3F5;
        border-bottom-left-radius: 0;

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