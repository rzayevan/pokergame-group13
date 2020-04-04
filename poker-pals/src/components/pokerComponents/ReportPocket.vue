<template>
    <div class="reportBoxBorder"> <!--the report box that is toggled in and out of view when a report is requested-->
        <div class="submit-message" v-if="!showForm && submittedSuccessfully">
            <div class="message-container">
                <div> 
                    Report submitted successfully
                </div>
                <b-button class="centerText ok-button" variant="outline-primary" @click="closeReport()">
                    OK
                </b-button>  
            </div>  
        </div>
        <div class="submit-message" v-if="!showForm && !submittedSuccessfully">
            <div class="message-container">
                <div> 
                    Could not submit report
                </div>
                <b-button class="centerText ok-button" variant="outline-primary" @click="closeReport()">
                    OK
                </b-button>  
            </div>                  
        </div>
        <div class="reportBox" v-if="showForm">
            <b-row class="row d-flex justify-content-between">
                <div class="reportHeader">
                    Report
                </div>
                <b-button class="close" @click="closeReport()">
                    &times;
                </b-button>
            </b-row>
            <b-row class="row">
                <div class="offending-user-header">File a report against <strong class="extraBold">{{ report_OffenderName }}</strong></div>
            </b-row>
            <b-row class="row">
                <div class="prompt">Did you witness any of the following?</div>
                <select class="selector" v-model="selected">
                    <option disabled value="">Select an option</option>
                    <option>option 1</option>
                    <option>option 2</option>
                    <option>option 3</option>
                </select>
                <div id="option-warning" class="warning hidden">
                    Please select an option.
                </div>
            </b-row>
            <b-row>
                <div class="prompt">Please describe the reason for reporting.</div>
                <!-- <textarea class="inputTextBox" v-model="message"></textarea> -->
                <b-form-textarea
                    id="textarea"
                    class="inputTextBox"
                    v-model="message"
                    placeholder="Enter a reason..."
                    rows="3"
                    max-rows="2"
                    >
                </b-form-textarea>
                <div id="reason-warning" class="warning hidden">
                    Please enter a reason.
                </div>
            </b-row>
            <b-row class="d-flex justify-content-end">
                 <b-button class="report-button centerText" variant="light" @click="closeReport()">
                    Cancel
                </b-button>
                 <b-button class="buttonSubmit centerText report-button" variant="primary" @click="submitReport()">
                    Submit
                </b-button>
            </b-row>
            

    
        </div>
    </div>
</template>

<style scoped>
    .row {
        margin-left: 0;
        margin-right: 0;
    }

    .reportBoxBorder{
        float: left;
        width: 30%;
        height: 46.5%;
        background: #f2f3f5;
        padding: 1.5% 1%;
        /* border: solid 2px #dedede; */
    }
    .submit-message {
        display: flex;
        align-content: center;
        width: 100%;
        height: 100%;
    }
    .message-container {
        margin: auto;
    }
    .message-content {
        font-size: 1vw;
        text-align: left;
    }

    .ok-button {
        margin: auto;
        font-size: 1vw;
           border-color: #01b0d9;
           background-color: white;
        /* color: white; */
    }

    .ok-button:hover {
        background-color: #01b0d9;
    }

    .reportBox{
        float: left;
        width: 100%;
        height: 100%;
        /* margin: 0% 0% 0% 0.5%; */
     
    }
    .reportHeader{
        /* float: left;
        width: 33%;
        height: 15%; */
        font-size: 1.5vw;
        /* background: transparent; */
        font-weight: 1000;
        color: black;
    }
    .buttonXOuter{
        float: left;
        width: 13%;
        height: 13%;
        margin: 2% 0% 0% 48%;
        cursor: pointer;
    }
    .buttonXOuter:active{
        transform: translateY(4%);
    }
    .close {
        padding: 0% 3%;
         font-size: 1.5vw;
    }
    .close:hover {
        background-color: white;
    }

    /* .buttonX{
        float: left;
        width: 90%;
        height: 90%;
        font-size: 1.5vw;
        margin: 5% 0% 0% 5%;
        background: #bf214b;
        color: white;
    } */
    .offending-user-header {
        float: left;
        width: 94%;
        height: 10%;
        font-size: 1.15vw;
        text-align: left;
        color: black;
    }
    .prompt {
        float: left;
        width: 94%;
        height: 10%;
        font-size: 1vw;
        margin: 5% 0% 0% 0%;
        text-align: left;
        color: black;
    }

    .warning {
        float: left;
        width: 94%;
        height: 10%;
        font-size: 0.8vw;
        background: transparent;
        text-align: left;
        color: rgb(196, 0, 0);
        font-style: italic;
    }

    .hidden {
        display: none;
    }

    .selector{
        float: left;
        width: 70%;
        height: 10%;
        font-size: 1vw;
        border-radius: 2%/12%;
        border-color: #ced4da;
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
        width: 100%;
        height: 15%;
        font-size: 1vw;
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
    .oldButtonSubmit{
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

    .report-button {
        width: 20%;
        height: 10%;
        font-size: 1vw;
        margin: 3% 0% 0% 3%;
    }

    .buttonSubmit {
        background: #01b0d9;
        color: white;
    }

    .buttonSubmit:hover {
        background: #0199bb;
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
        "showForm",
        "submittedSuccessfully"
    ],
    data(){
        return {
            selected: '',
            message: ''
        }
    },
    methods:{
        closeReport(){
            this.$parent.closeReport();
        },
        submitReport(){
            if(this.selected === '' || this.message === ''){
                this.setSelectionWarningVisibility(this.selected);
                this.setReasonWarningVisibility(this.message);
            }
            else {
                // send off report to the parent
                this.$parent.submitReport(this.selected, this.message, this.report_OffenderName, this.report_OffenderMessageId);
            }
        },
        setSelectionWarningVisibility(selection) {
            let optionWarning = document.getElementById("option-warning");
            if (selection === '') {
                optionWarning.classList.remove("hidden");
            }
            else {
                optionWarning.classList.add("hidden");
            }
        },
        setReasonWarningVisibility(message) {
            let reasonWarning = document.getElementById("reason-warning");
            if (message === '') {
                reasonWarning.classList.remove("hidden");
            }
            else {
                reasonWarning.classList.add("hidden");
            }
        }
    }
}
</script>