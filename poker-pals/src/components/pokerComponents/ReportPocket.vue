<template>
    <div class="reportBoxBorder">
        <div class="reportBox">
            <div class="reportTag centerText">Report</div>
            <button class="buttonX centerText" v-on:click="cancelReport()">X</button>
            <div class="title1">Filing a report against player: <strong class="extraBold">{{ report_OffenderName }}</strong></div>
            <div class="title2">Did you witness any of the following?</div>
            <select class="selector" v-model="selected">
                <option disabled value="">Select an option</option>
                <option>Beating me, because that's not fair</option>
                <option>Taking all my chips</option>
                <option>Having a better hand than me</option>
            </select>
            <div class="title3">Please describe the reason for reporting.</div>
            <textarea class="inputTextBox" v-model="message"></textarea>
            <button class="buttonCancel centerText" v-on:click="cancelReport()">Cancel</button>
            <button class="buttonSubmit centerText" v-on:click="submitReport()">Submit</button>
        </div>
    </div>
</template>

<style scoped>
    .reportBoxBorder{
        float: left;
        width: 30%;
        height: 46.5%;
        background: black;
    }
    .reportBox{
        float: left;
        width: 99%;
        height: 99%;
        background: #dedede;
        margin: 0% 0% 0% 0.5%;
    }
    .reportTag{
        float: left;
        width: 33%;
        height: 15%;
        font-size: 2vw;
        background: transparent;
        font-weight: 1000;
        color: black;
    }
    .buttonX{
        float: left;
        width: 13%;
        height: 13%;
        font-size: 1.5vw;
        margin: 2% 0% 0% 48%;
        background: #bf214b;
        color: white;
        border-color: #666666;
    }
    .title1{
        float: left;
        width: 94%;
        height: 10%;
        font-size: 1.25vw;
        margin: 0% 0% 0% 3%;
        background: transparent;
        text-align: left;
        color: black;
    }
    .title2{
        float: left;
        width: 94%;
        height: 10%;
        font-size: 1vw;
        margin: 5% 0% 0% 3%;
        background: transparent;
        text-align: left;
        color: black;
    }
    .selector{
        float: left;
        width: 70%;
        height: 10%;
        font-size: 1vw;
        border-radius: 2%/12%;
        margin: 0% 0% 0% 3%;
    }
    .title3{
        float: left;
        width: 94%;
        height: 10%;
        font-size: 1vw;
        margin: 5% 0% 0% 3%;
        background: transparent;
        text-align: left;
        color: black;
    }
    .inputTextBox{
        float: left;
        width: 94%;
        height: 17%;
        font-size: 1vw;
        margin: 0% 0% 0% 3%;
        text-align: left;
        resize: none;
    }
    .buttonCancel{
        float: left;
        width: 20%;
        height: 10%;
        font-size: 1vw;
        border-radius: 10%/20%;
        border: 1px solid black;
        margin: 3% 0% 0% 53%;
    }
    .buttonSubmit{
        float: left;
        width: 20%;
        height: 10%;
        font-size: 1vw;
        border-radius: 10%/20%;
        border: 1px solid black;
        margin: 3% 0% 0% 3%;
        background: #01b0d9;
        color: white;
    }
    .extraBold{
        font-weight: 1000;
    }
    .centerText{
        display : flex;
        align-items : center;
        justify-content: center;
    }
</style>

<script>
export default {
    name: "ReportPocket",
    props: [
        "report_OffenderName",
        "report_OffenderMessageId",
    ],
    data(){
        return {
            selected: '',
        }
    },
    methods:{
        cancelReport(){
            this.$parent.cancelReport();
        },
        submitReport(){
            this.$parent.cancelReport();
        }

    }
}
</script>