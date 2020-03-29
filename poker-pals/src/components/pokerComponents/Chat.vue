<template>
    <div class="chatBox" v-bind:class="{ chatBoxFull: full, chatBoxHalf: !full }"> <!--the chat container holding all the chat elements together-->
            <div class="title" v-bind:class="{ titleFull: full, titleHalf: !full }">
                <div class="title_text centerText">{{ tableName }}</div>
            </div>
            <div class="messagesBoxBorder" v-bind:class="{ messagesBoxBorderFull: full, messagesBoxBorderHalf: !full }"> <!--contains all the chat messages in the form of a list-->
                <div class="messagesBox" v-bind:class="{ messagesBoxFull: full, messagesBoxHalf: !full }">
                    <!--these buttons are not permanent, only for testing functionality-->
                    <button class="testButton" v-on:click="$parent.logIn('948bf810-71e2-11ea-a8e0-73473bc162b1')">log in as dev</button>
                    <button class="testButton" v-on:click="$parent.logIn('9e9a98d0-71e6-11ea-b474-933b66303ca9')">log in as john</button>
                    <button class="testButton" v-on:click="$parent.logIn('8fd55dc0-71f6-11ea-a4ad-f1607ee8ca58')">log in as mack</button>
                    <button class="testButton" v-on:click="$parent.logIn(4000)">log in as userID:4000</button>
                    <button class="testButton" v-on:click="$parent.logIn(5000)">log in as userID:5000</button>
                    <button class="testButton" v-on:click="$parent.logIn(6000)">log in as userID:6000</button>
                    <button class="testButton" v-on:click="$parent.joinTable(0)">join table 0</button>
                    <button class="testButton" v-on:click="$parent.joinTable(1)">join table 1</button>
                    <button class="testButton" v-on:click="$parent.joinTable(2)">join table 2</button>
                    <button class="testButton" v-on:click="$parent.joinTable(3)">join table 3</button>
                    <button class="testButton" v-on:click="$parent.joinTable(4)">join table 4</button>
                    <button class="testButton" v-on:click="$parent.joinTable(5)">join table 5</button>
                    

                    <div v-for="item in items" :key="item.message"> <!--display each message according to whom is the sender-->
                        <ChatMessage v-bind:you="item.id === userID ? true : false" v-bind:name="item.name" v-bind:message="item.message" v-bind:messageId="item.id"/>
                        <div class="chatSpace">space</div>
                    </div>
                </div>
            </div>
            <div class="inputBoxBorder" v-bind:class="{ inputBoxBorderFull: full, inputBoxBorderHalf: !full }"> <!--the input of the chat, allows for sending messages-->
                <div class="inputBox">
                    <input type="text" class="input" placeholder="Type a message">
                    <button class="submitButton centerText">SEND</button>
                </div>
            </div>
        </div>
</template>

<style scoped>
    .chatSpace{
        float: left;
        width: 50%;
        color: transparent;
        font-size: 0.5vw;
    }
    .chatBox{
        float: left;
        width: 30%;
        background: cyan;
    }
    .chatBoxHalf{
        height: 46.5%;
    }
    .chatBoxFull{
        height: 93%;
    }
    .title{
        float: left;
        width: 100%;
        background: #eeeeee;
        background: black;
        margin: 0%;
    }
    .titleHalf{
        height: 12%;
    }
    .titleFull{
        height: 6%;
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
        background: black;
    }
    .messagesBoxBorderHalf{
        height: 85%;
    }
    .messagesBoxBorderFull{
        height: 92.5%;
    }
    .messagesBox{
        float: left;
        width: 99%;
        background: #eeeeee;
        margin: 0% 0% 0% 0.5%;
        overflow-y: auto;
    }
    .messagesBoxHalf{
        height: 85%;
    }
    .messagesBoxFull{
        height: 93.2%;
    }
    .inputBoxBorder{
        width: 100%;
        background: black;
    }
    .inputBoxBorderHalf{
        height: 15%;
    }
    .inputBoxBorderFull{
        height: 7.5%;
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
        margin: 0%;
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
import ChatMessage from './ChatMessage.vue';

export default {
    name: "Chat",
    components: {
        ChatMessage,
    },
    props: [
        'full', 'tableName', 'userID'
    ],
    data() {
        return {
            items: [ // right now chat does not receive messages, either it will use props or have its own socket functions
                // sample messages stored in chat
                { id: 1000, name: 'Mark123', message: 'Foo kjh g n hy kb jk gbn g n g n ihg n g h b jh gi h gv tgb g' },
                { id: 2000, name: 'John456', message: 'Barh g n hy kb jk gbn g n g n ihg n g h b jh' },
                { id: 3000, name: 'Luke854', message: 'no' },
                { id: 3000, name: 'Luke854', message: 'hellofgd ggf df gd gh rf tr r gh g fd gh t t t   gg er g  gt g rt g gtg g trd g g g dr gt gdr g f t hg fdt ghtrf gh f h yh' },
                { id: 3000, name: 'Luke854', message: 'hello  t t   gg er g  gt g rt g gtg g trd g g g dr gt gdr g f t hg fdt ghtf f g fd g fg h ' },
                { id: 3000, name: 'Luke854', message: 'hello rf gh fd hg g t g g g  f hhg f hdfh' },
                { id: 3000, name: 'Luke854', message: 'hello r g r gt g t   f' },
                { id: 3000, name: 'Luke854', message: 'hello' },
            ],
        }
    },
    methods:{
        openReport(name, messageId){ // when a message is clicked on and the report symbol is clicked, a call back is made to open up the report box
            // called by a ChatMessage child
            // pass the message along to the parent
            this.$parent.openReport(name, messageId);
        }
    }
};
</script>