<template>
    <div class="container">
        <b-row class="title" align-v="center" no-gutters>
            <h3 class="col-12">{{ tableName }}</h3>
        </b-row>
        <b-row class="chatBox">
            <b-col>
                <!--these buttons are not permanent, only for testing functionality-->
                <b-row v-show="false">
                    <button class="testButton" v-on:click="$parent.logIn('948bf810-71e2-11ea-a8e0-73473bc162b1')">log in as dev</button>
                    <button class="testButton" v-on:click="$parent.logIn('9e9a98d0-71e6-11ea-b474-933b66303ca9')">log in as john</button>
                    <button class="testButton" v-on:click="$parent.logIn('8fd55dc0-71f6-11ea-a4ad-f1607ee8ca58')">log in as mack</button>
                    <button class="testButton" v-on:click="$parent.joinRoom(0)">join room 0</button>
                    <button class="testButton" v-on:click="$parent.joinRoom(1)">join room 1</button>
                    <button class="testButton" v-on:click="$parent.joinRoom(2)">join room 2</button>
                    <button class="testButton" v-on:click="$parent.joinRoom(3)">join room 3</button>
                    <button class="testButton" v-on:click="$parent.joinRoom(4)">join room 4</button>
                    <button class="testButton" v-on:click="$parent.joinRoom(5)">join room 5</button>
                </b-row>
                <div id="messages" >
                    <ChatMessage v-for="item in items"
                         :key="item.id"
                         v-bind:you="item.senderID === userID"
                         v-bind:name="item.name"
                         v-bind:message="item.message"
                         v-bind:messageId="item.id"
                    />
                </div>
            </b-col>
        </b-row>
        <b-row class="inputBox py-1">
            <input type="text" class="input col-8 " placeholder="Type a message">
            <button type="button" class="btn col-4">SEND</button>
        </b-row>
    </div>
</template>

<style scoped>
    .container {
        height: 100%;
        background-color: #F2F3F5;
    }

    .title {
        width: 100%;
        height: 10%;
        background: #F2F3F5;
    }

    .chatBox {
        background-color: white;
        height: 80%;
        overflow-y: auto;
    }

    #messages {
        overflow-y: auto;
    }

    .inputBox {
        background: white;
        height: 10%;
    }

    .input {
        border: none;
    }

    .btn {
        background-color: #01B0D9;
        color: white;
    }
</style>

<script>
    import ChatMessage from './ChatMessage.vue';

    export default {
        name: "Chat",
        components: {
            ChatMessage,
        },
        data() {
            return {
                tableName: 'Big Fish',
                userID: 1000,
                items: [ // right now chat does not receive messages, either it will use props or have its own socket functions
                    // sample messages stored in chat
                    { id: 1, senderID: 1000, name: 'Mark123', message: 'Hi!' },
                    { id: 2, senderID: 2000, name: 'John456', message: 'gl hf!' },
                    { id: 3, senderID: 3000, name: 'Luke854', message: 'no' },
                    { id: 4, senderID: 3000, name: 'Luke854', message: '>:(' },
                    { id: 5, senderID: 3000, name: 'John456', message: 'oh okay... ' },
                    { id: 6, senderID: 3000, name: 'Mark123', message: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.' },
                    { id: 7, senderID: 3000, name: 'Luke854', message: 'f' },
                    { id: 8, senderID: 3000, name: 'Luke854', message: 'asdsad' },
                    { id: 9, senderID: 1000, name: 'Mark123', message: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.' },
                    { id: 10, senderID: 3000, name: 'Luke854', message: 'f' },
                    { id: 11, senderID: 3000, name: 'Mark123', message: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.' },
                    { id: 12, senderID: 3000, name: 'Luke854', message: 'f' },
                    { id: 13, senderID: 1000, name: 'Luke854', message: 'f' },
                    { id: 14, senderID: 1000, name: 'Luke854', message: 'f' },
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