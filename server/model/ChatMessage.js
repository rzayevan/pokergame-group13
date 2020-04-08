const { v1: uuid } = require('uuid');

class ChatMessage {
    /**
     * Creates a ChatMessage object
     * @param {String} tableID The uuid of the table the message occurred at
     * @param {User} user The user that sent the message
     * @param {String} message The message sent by the user
     */
    constructor(tableID, user, message) {
        // The uuid of the message
        this.id = uuid();
        // The uuid of the table this message occured at
        this.tableID = tableID;
        // The uuid of the user
        this.userID = user.id;
        // The username of the User sending the message
        this.username = user.username;
        // The message that was sent by the User
        this.message = message;
    }
}
module.exports = ChatMessage;