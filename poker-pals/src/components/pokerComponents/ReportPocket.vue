<template>
    <div class="reportBoxBorder"> <!--the report box that is toggled in and out of view when a report is requested-->
        <div class="reportBox">
            <div class="reportTag centerText">Report</div>
            <div class="buttonXOuter" v-on:click="cancelReport()">
                <div class="buttonX centerText">X</div>
            </div>
            <div class="mainTitle">Filing a report against player: <strong class="extraBold">{{ report_OffenderName }}</strong></div>
            <div class="witnessQuestionText">Did you witness any of the following?</div>
            <select class="selector" v-model="selected">
                <option disabled value="">Select an option</option>
                <option>option 1</option>
                <option>option 2</option>
                <option>option 3</option>
            </select>
            <div class="describeReasonText">Please describe the reason for reporting.</div>
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
    .buttonXOuter{
        float: left;
        width: 13%;
        height: 13%;
        margin: 2% 0% 0% 48%;
        background: #666666;
        cursor: pointer;
    }
    .buttonXOuter:active{
        transform: translateY(4%);
    }
    .buttonX{
        float: left;
        width: 90%;
        height: 90%;
        font-size: 1.5vw;
        margin: 5% 0% 0% 5%;
        background: #bf214b;
        color: white;
    }
    .mainTitle{
        float: left;
        width: 94%;
        height: 10%;
        font-size: 1.25vw;
        margin: 0% 0% 0% 3%;
        background: transparent;
        text-align: left;
        color: black;
    }
    .witnessQuestionText{
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
    .describeReasonText{
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
            message: '',
        }
    },
    methods:{
        cancelReport(){
            this.$parent.cancelReport();
        },
        submitReport(){
            if(this.selected === ''){
                alert('please select reason'); // later use alternative option to indicate this
            }
            else{
                // send off report to the parent
                this.$parent.submitReport(this.selected, this.message, this.report_OffenderName, this.report_OffenderMessageId);
            }
        }

    }
}
</script>