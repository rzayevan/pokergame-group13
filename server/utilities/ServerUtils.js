/**
 * The maximum number of ChatMessage objects to have stored in the local cache
 */
const NUMBER_OF_CHATMESSAGE_TO_STORE = 1000;

/**
 * Returns the NUMBER_OF_CHATMESSAGE_TO_STORE constant
 */
exports.GetMaxChatMessages = function() {
    return NUMBER_OF_CHATMESSAGE_TO_STORE;
}