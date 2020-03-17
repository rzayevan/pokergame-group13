<template>
    <div class="chatBox" :style="{ height: heightPercentages.chatBox }">
            <div class="title" :style="{ height: heightPercentages.title }">
                <div class="title_text centerText">Big Fish</div>
            </div>
            <div class="messagesBoxBorder" :style="{ height: heightPercentages.messagesBoxBorder }">
                <div class="messagesBox" :style="{ height: heightPercentages.messagesBox }">
                    <button class="testButton" v-on:click="$parent.revealCommunityCard(1, 'Q_D')">1</button>
                    <button class="testButton" v-on:click="$parent.revealCommunityCard(2, '4_S')">2</button>
                    <button class="testButton" v-on:click="$parent.revealCommunityCard(3, '9_C')">3</button>
                    <button class="testButton" v-on:click="$parent.revealCommunityCard(4, '6_S')">4</button>
                    <button class="testButton" v-on:click="$parent.revealCommunityCard(5, '10_C')">5</button>
                    <button class="testButton" v-on:click="$parent.switchDealers()">6</button>
                    <button class="testButton" v-on:click="$parent.changeBets()">7</button>
                    <button class="testButton" v-on:click="$parent.showPlayerCards()">8</button>
                    <button class="testButton" v-on:click="$parent.revealPlayerCards()">9</button>
                    <button class="testButton" v-on:click="$parent.changeNames()">10</button>
                    <button class="testButton" v-on:click="$parent.changeTagImages()">11</button>
                    <button class="testButton" v-on:click="$parent.changeTimer1()">12</button>
                    <button class="testButton" v-on:click="$parent.changeTimer2()">13</button>
                    <button class="testButton" v-on:click="$parent.reportPlayer()">14</button>
                </div>
            </div>
            <div class="inputBoxBorder" :style="{ height: heightPercentages.inputBoxBorder }">
                <div class="inputBox">
                    <input type="text" class="input" value="Type a message">
                    <button class="submitButton centerText">SEND</button>
                </div>
            </div>
        </div>
</template>

<style scoped>
    .chatBox{
        float: left;
        width: 30%;
        height: 46.5%;
        background: cyan;
    }
    .title{
        float: left;
        width: 100%;
        height: 12%;
        background: #eeeeee;
        background: black;
        margin: 0% 0% 0% 0%;
    }
    .title_text{
        width: 99%;
        height: 90%;
        margin: 0.5% 0% 0% 0.5%;
        background: #eeeeee;
        font-size: 1.75vw;
    }
    .messagesBoxBorder{
        width: 100%;
        height: 85%;
        background: black;
    }
    .messagesBox{
        float: left;
        width: 99%;
        height: 85%;
        background: #eeeeee;
        margin: 0% 0% 0% 0.5%;
    }
    .inputBoxBorder{
        width: 100%;
        height: 15%;
        background: black;
    }
    .inputBox{
        float: left;
        width: 98.9%;
        height: 92%;
        background: white;
        margin: 0.2% 0% 0% 0.5%;
    }
    .input{
        float: left;
        width: 78%;
        height: 93%;
        margin: 0% 0% 0% 0%;
        overflow: hidden;
        border: none;
        background: transparent;
        font-size: 1.5vw;
    }
    .submitButton{
        float: left;
        width: 20%;
        height: 70%;
        background: #01b0d9;
        border: 1px solid black;
        border-radius: 15%/30%;
        color: white;
        margin: 2% 0% 0% 0%;
        font-size: 1vw;
    }
    .centerText{
        display : flex;
        align-items : center;
        justify-content: center;
    }
</style>

<script>

export default {
    name: "Chat",
    props: [
        'full',
    ],
    data() {
        return {
            heightPercentages: {chatBox: '93%', title: '6%', messagesBoxBorder: '92.5%', messagesBox: '93.2%', inputBoxBorder: '7.5%'},
        }
    },
    mounted(){
        if(this.full){
            this.heightPercentages = {chatBox: '93%', title: '6%', messagesBoxBorder: '92.5%', messagesBox: '93.2%', inputBoxBorder: '7.5%'};
        }
        else{
            this.heightPercentages = {chatBox: '46.5%', title: '12%', messagesBoxBorder: '85%', messagesBox: '85%', inputBoxBorder: '15%'};
        }
    },
    watch: {
        full: function(){
            if(this.full){
                this.heightPercentages = {chatBox: '93%', title: '6%', messagesBoxBorder: '92.5%', messagesBox: '93.2%', inputBoxBorder: '7.5%'};
            }
            else{
                this.heightPercentages = {chatBox: '46.5%', title: '12%', messagesBoxBorder: '85%', messagesBox: '85%', inputBoxBorder: '15%'};
            }
        }
    },
    methods:{
        
    }
};
</script>