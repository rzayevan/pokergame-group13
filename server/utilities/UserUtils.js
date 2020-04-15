const DataAccessLayer = require('../controllers/DataAccessLayer.js');
const NUMBER_OF_ICONS = 16;
const DAILY_BONUS_VALUE = 100;

/**
 * Checks if the provided credentials match the ones stored in the application
 */
exports.credentialsMatch = function(user) {
    let users = DataAccessLayer.GetCachedUsers();
    let matchFound = false;
    let userData = {};
    let banned = false;
    users.forEach(existingUser => {
        if (user.email.toLowerCase() === existingUser.email.toLowerCase() && user.password === existingUser.password) {
            matchFound = true;
            userData = existingUser;
            banned = existingUser.banned;
        }
    });

    return {matchFound: matchFound, userData: userData, banned: banned};
}

/**
 * Checks whether or not the provided email is unique
 */
exports.emailExists = function(user) {
    let users = DataAccessLayer.GetCachedUsers();
    let emailExists = false;

    users.forEach(existingUser => {
        if (user.email.toLowerCase() === existingUser.email.toLowerCase()) {
            emailExists = true;
        }
    });

    return emailExists;
}

/**
 * Will set the loggedIn status and socketID of the supplied user
 * Returns the updated user data
 */
exports.updateUserLoginInfo = function(user, loggedIn, socketID) {
    user.socketID = socketID;
    user.isLoggedIn = loggedIn;
    DataAccessLayer.UpdateUser(user);
    return this.getUserById(user.id);
}

/**
 * Returns complete user data based on the data provided from client
 */
exports.getUserFromClientData = function(clientData) {
    let users = DataAccessLayer.GetCachedUsers();
    
    let matchingUser = users.find(user => {
        return clientData.email.toLowerCase() === user.email.toLowerCase() && clientData.password === user.password;
    });

    return matchingUser;
}

/**
 * Returns user data from id provided
 */
exports.getUserById = function(id) {
    let users = DataAccessLayer.GetCachedUsers();

    let matchingUser = users.find(user => {
        return user.id === id;
    });

    return matchingUser;
}

/**
 * Returns user data from socketID provided
 */
exports.getUserBySocketId = function(socketID) {
    let users = DataAccessLayer.GetCachedUsers();

    let matchingUser = users.find(user => {
        return user.socketID === socketID;
    });

    return matchingUser;
}

/**
 * Returns user data from username provided
 */
exports.getUserByUsername = function(username) {
    let users = DataAccessLayer.GetCachedUsers();

    let matchingUser = users.find(user => {
        return user.username === username;
    });

    return matchingUser;
}

/**
 * Returns the name of a new user icon
 */
exports.createUserIcon = function(number) {
    if (number !== undefined && !Number.isNaN(number)) {
        return 'player_icon_' + number.toString();
    }

    return 'player_icon_' + Math.floor(Math.random()*NUMBER_OF_ICONS+1).toString();
}

/**
 * Returns the daily bonus value
 */
exports.getDailyBonusValue = function() {
    return DAILY_BONUS_VALUE;
}