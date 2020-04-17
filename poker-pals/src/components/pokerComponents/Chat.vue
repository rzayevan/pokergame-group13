<template>
    <div class="container-fluid">
        <b-row class="title p-2 m-0 no-gutters" align-v="center" >
            <span class="col-12">{{ tableName }}</span>
        </b-row>
        <b-row id="chatBox" class="p-2 no-gutters">
            <b-col>
                <div id="messages">
                    <ChatMessage v-for="item in items" :key="item.id"
                                 v-bind:you="item.you"
                                 v-bind:name="item.name"
                                 v-bind:message="item.message"
                                 v-bind:messageId="item.id"
                    />
                </div>
            </b-col>
        </b-row>
        <form class="row no-gutters" v-on:submit="sendMessage" >
            <input type="text" class="input col-8 p-2" v-model="message" placeholder="Type a message">
            <button type="submit" class="btn col-4">SEND</button>
        </form>
    </div>
</template>

<style scoped>
    .container-fluid {
        max-height: 100%;
        height: 100%;
        background-color: #F2F3F5;

    }

    .title {
        width: 100%;
        height: 10%;
        max-height: 10%;
        background: #F2F3F5;
    }

    .title span {
        font-size: 2vmin;
    }

    #chatBox {
        width: 100%;
        background-color: white;
        height: 80%;
        overflow-y: auto;
        overflow-x: hidden;
    }

    #messages {
        width: 100%;
        position: absolute;
    }

    form {
        height: 10%;
        max-height: 10%;
        background: white;
    }

    .input {
        max-width: 100%;
        max-height: 100%;
        border: none;
    }

    .btn {
        background-color: #01B0D9;
        color: white;
        max-width: 100%;
        max-height: 100%;
        font-size: 2vmin;
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
                userData: this.$parent.userData,
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
                setTimeout(this.updateScroll,100);
            },
            
            updateScroll: function(){
                var element = document.getElementById("chatBox");
                element.scrollTop = element.scrollHeight;
            },
        }
    }   
</script>