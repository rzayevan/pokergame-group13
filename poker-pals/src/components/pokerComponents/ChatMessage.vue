<template>
    <!-- Display a received message. -->
    <b-row v-if="!you" no-gutters @mouseenter="toggleOptions" @mouseleave="toggleOptions">
        <b-col v-if="!you" class="d-inline-flex my-1 ml-1">
            <div class="message received">
                <p class="m-1">
                    <b>{{name}}</b><br>
                    {{message}}
                </p>
            </div>
            <div v-show="showOptions" class="material-icons ml-1">
                <button id="block" class="ml-1 p-1" @click="block">block</button>
                <button id="report" class="ml-1 p-1" @click="report">report</button>
            </div>
        </b-col>
    </b-row>

    <!--  Display a sent message.  -->
    <b-row v-else no-gutters>
        <b-col class="my-1">
            <div class="message sent">{{ message }}</div>
        </b-col>
    </b-row>
</template>

<style scoped>
    .message{
        max-width: 70%;
        border-radius: 1em;
        padding: 6px 10px;
        text-align: left;
        font-size: 14px;
        word-wrap: break-word;
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
        align-self: center;
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
                showOptions: false,
            }
        },
        methods:{
            /**
             *  Toggle the visibility of  block and report options associated with this message.
             */
            toggleOptions(){
                this.showOptions = !this.showOptions;
            },

            /**
             *  Mute the user who sent this message.
             */
            block() {
                // TODO: Implement block/mute
            },

            /**
             *  Report the user who sent this message.
             */
            report() {
                this.$parent.openReport(this.name, this.messageId);
            }
        }
    }
</script>