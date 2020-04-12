<template>
    <div class="reportBoxBorder"> <!--the report box that is toggled in and out of view when a report is requested-->
        <div class="submit-message" v-if="!showForm && submittedSuccessfully">
            <div class="message-container">
                <b-row class="report-message">
                    <b-nav-text class="material-icons"> check_circle </b-nav-text> 
                    <div>Report submitted successfully</div>
                    <div class="message-text">Your report will be reviewed shortly.</div>
                </b-row>
                 <b-row class="ok-container">
                    <b-button class="centerText ok-button" variant="outline-primary" @click="closeReport()">OK</b-button>  
                </b-row>       
            </div>  
        </div>
        <div class="submit-message" v-if="!showForm && !submittedSuccessfully">
            <div class="message-container">               
                  <b-row class="report-message">
                    <b-nav-text class="material-icons"> cancel </b-nav-text> 
                    <div>Failed to submit report</div>
                    <div class="message-text">Please try again.</div>
                </b-row>
                 <b-row class="ok-container">
                    <b-button class="centerText ok-button" variant="outline-primary" @click="closeReport()">OK</b-button>  
                </b-row>
            </div>                  
        </div>
        <div class="reportBox" v-if="showForm">
            <b-row class="row d-flex justify-content-between">
                <div class="reportHeader">Report</div>
                <b-button class="close" @click="closeReport()">&times;</b-button>
            </b-row>
            <b-row class="row">
                <div class="offending-user-header">File a report against <strong class="extraBold">{{ report_OffenderName }}</strong></div>
            </b-row>
            <b-row class="row">
                <div class="prompt">What type of behaviour did you witness?</div>
                <select class="type-dropdown" v-model="selected">
                    <option disabled value="">Select an option</option>
                    <option>Harassment</option>
                    <option>Swearing</option>
                    <option>Spam</option>
                    <option>Offensive username</option>  
                    <option>Other</option>         
                </select>
                <div id="option-warning" class="warning" v-show="showSelectionWarning">Please select an option</div>
            </b-row>
            <b-row>
                <div class="prompt">Please describe the offensive behaviour</div>
                <b-form-textarea
                    id="textarea"
                    class="inputTextBox"
                    v-model="message"
                    placeholder="Enter a reason..."
                    rows="3"
                    max-rows="2"
                    >
                </b-form-textarea>
                <div id="reason-warning" class="warning" v-show="showMesssageWarning">Please enter a reason</div>
            </b-row>
            <b-row class="d-flex justify-content-end">
                 <b-button class="report-button centerText" variant="light" @click="closeReport()">Cancel</b-button>
                 <b-button class="buttonSubmit centerText report-button" variant="primary" @click="submitReport()">Submit</b-button>
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
    }
    .submit-message {
        display: flex;
        width: 100%;
        height: 100%;
    }
    .message-container {
        width: 100%;
        height: 100%;
        margin: auto;
        display: flex;
        flex-direction: column;
        justify-content: space-around;
    }
    .message-content {
        font-size: 1vw;
        text-align: left;
    } 
    .report-message {
        display: flex;
        justify-content: center;
        flex-direction: column;
    }
    .message-text {
        font-size: 1vw;
    }
    .ok-container {
        display: flex;
        justify-content: flex-end;
    }
    .ok-button {
        font-size: 1vw;
        border-color: #01b0d9;
        color: #01b0d9;
        background-color: white;
    }
    .ok-button:hover {
        background-color: #01b0d9;
        color: white;
    }
    .material-icons {
        font-size: 5vw !important;
    }
    .reportBox{
        float: left;
        width: 100%;
        height: 100%;     
    }
    .reportHeader{
        font-size: 1.5vw;
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
    .offending-user-header {
        float: left;
        width: 94%;
        height: 10%;
        font-size: 1vw;
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
    .type-dropdown{
        float: left;
        width: 70%;
        height: 10%;
        font-size: 1vw;
        border-radius: 2%/12%;
        border-color: #ced4da;
    }
    .inputTextBox{
        float: left;
        width: 100%;
        height: 15%;
        font-size: 1vw;
        resize: none;
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
            message: '',
            showSelectionWarning: false,
            showMesssageWarning: false
        }
    },
    methods:{
        closeReport(){
            this.$parent.closeReport();
        },
        submitReport() {
            // Check that all fields were filled 
            if(this.selected === '' || this.message === ''){
                this.setSelectionWarningVisibility(this.selected);
                this.setReasonWarningVisibility(this.message);
            }
            else {
                // Send a filled report to the parent for submission to server
                let submittingUser = this.$parent.userData.id;
                this.$parent.submitReport(this.selected, this.message, this.report_OffenderName, this.report_OffenderMessageId, submittingUser);
            }
        },
        // Display or hide selection warning
        setSelectionWarningVisibility(selection) {
            if (selection === '') {
                this.showSelectionWarning = true;
            }
            else {
                this.showSelectionWarning = false;
            }
        },
        // Display or hide reason warning
        setReasonWarningVisibility(message) {
            if (message === '') {
                this.showMesssageWarning = true;
            }
            else {
                this.showMesssageWarning = false;
            }
        }
    }
}
</script>