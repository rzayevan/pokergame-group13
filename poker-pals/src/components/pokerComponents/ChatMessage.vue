<template>
    <!-- Display a received message. -->
    <b-row v-if="!you" no-gutters>
        <b-col v-if="!you" class="col-10 text-left my-1 ml-1 ">
            <div class=" message received">
                <p class="text-left m-1 ">
                    <b>{{name}}</b><br>
                    {{message}}
                </p>
<!-- TODO: Configure the option buttons and remove commented code. -->
<!--                <div class="mute borderRadius" v-if="optionsVisible">-->
<!--                    <div class="innerMute borderRadius">-->
<!--                        <img src="../../images/mute.png"/>-->
<!--                    </div>-->
<!--                </div>-->
<!--                <div class="report borderRadius" v-if="optionsVisible" v-on:click="openReport()">-->
<!--                    <div class="innerReport borderRadius"> dw-->
<!--                        <img src="../../images/report.png"/>-->
<!--                    </div>-->
<!--                </div>-->
            </div>
            <div class="material-icons ml-1">
                <button id="block" class="p-1">block</button>
                <button id="report" class="p-1">report</button>
            </div>
        </b-col>
    </b-row>

    <!--  Display a sent message.  -->
    <b-row v-else no-gutters>
        <b-col class="col-10 my-1" offset="2" >
            <div class="message sent" >{{ message }}</div>
        </b-col>
    </b-row>
</template>

<style scoped>
    .message{
        text-align: left;
        display: inline-block;
        max-width: 80%;
        border-radius: 1em;
        padding: 6px 10px;
        font-size: 14px;
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

    .material-icons {
        max-width: 10%;
        text-align: center;
        background-color: #F2F3F5;
    }

    .material-icons button {
        background-color: white;
        border: none;
    }

    .material-icons button:hover {
        color: #bf214b;
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