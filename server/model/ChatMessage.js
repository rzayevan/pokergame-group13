class ChatMessage {
    // Creates a chat message
    constructor(username, message) {
        // The username of the User sending the message
        this.username = username,
        // The message that was sent by the User
        this.message = message
    }
}
module.exports = ChatMessage;