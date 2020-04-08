<template>
    <div class="container">
        <b-row class="title" align-v="center" no-gutters>
            <h3 class="col-12">{{ tableName }}</h3>
        </b-row>
        <b-row id="chatBox">
            <b-col>
                <div id="messages" >
                    <ChatMessage v-for="item in items" :key="item.id"
                         v-bind:you="item.you"
                         v-bind:name="item.name"
                         v-bind:message="item.message"
                         v-bind:messageId="item.id"
                    />
                </div>
            </b-col>
        </b-row>
        <form class="row py-1" v-on:submit="sendMessage">
            <input type="text" class="input col-8" v-model="message" placeholder="Type a message">
            <button type="submit" class="btn col-4">SEND</button>
        </form>
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

    #chatBox {
        background-color: white;
        height: 80%;
        overflow-y: auto;
    }

    #messages {
        overflow-y: auto;
    }

    form {
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
                tableName: this.$parent.tableName,
                userID: this.$parent.userData.id,
                socket: this.$parent.socket,
                message: '',
                items: [],
            }
        },
        mounted: function() {
            let self = this;
            this.socket.on('messageSentSuccessful', function(msg){
                let you = msg.senderID === self.$parent.userData.id;
                self.addMessage({
                    id: msg.id, 
                    senderID: msg.senderID, 
                    name: msg.name, 
                    you: you, message: 
                    msg.message
                });
            });
        },
        methods:{
            openReport(name, messageId){
                // when a message is clicked on and the report symbol is clicked, a call back is made to open up the report box
                // called by a ChatMessage child
                // pass the message along to the parent
                this.$parent.openReport(name, messageId);
            },
            sendMessage: function (event) {
                event.preventDefault(); // prevent page reload
                if (this.message !== "" && this.message.trim() !== "") {
                    this.$parent.socket.emit("userSentMessage", {
                        userID: this.$parent.userData.id,
                        roomID: this.$parent.roomID,
                        message: this.message
                    });

                    // Clear the input field
                    this.message = "";
                }
            },
            addMessage: function (msg) {
                this.items.push(msg);
            }
        }
    };
</script>