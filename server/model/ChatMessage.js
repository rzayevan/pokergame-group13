const { v1: uuid } = require('uuid');

class ChatMessage {
    // Creates a chat message
    constructor(username, message) {
        // The uuid of the message
        this.id = uuid();
        // The username of the User sending the message
        this.username = username,
        // The message that was sent by the User
        this.message = message
    }
}
module.exports = ChatMessage;