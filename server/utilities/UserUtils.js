const DataAccessLayer = require('../controllers/DataAccessLayer.js');
const NUMBER_OF_ICONS = 16;

/**
 * Checks if the provided credentials match the ones stored in the application
 */
exports.credentialsMatch = function(user) {
    let users = DataAccessLayer.GetCachedUsers();
    let matchFound = false;
    let userID = -1;
    let banned = false;
    users.forEach(existingUser => {
        if (user.email.toLowerCase() === existingUser.email.toLowerCase() && user.password === existingUser.password) {
            matchFound = true;
            userID = existingUser.id;
            banned = existingUser.banned;
        }
    });

    return {matchFound: matchFound, userID: userID, banned: banned};
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

exports.getUserById = function(id) {
    let users = DataAccessLayer.GetCachedUsers();

    let matchingUser = users.find(user => {
        return user.id === id;
    });

    return matchingUser;
}

exports.getUserByUsername = function(username) {
    let users = DataAccessLayer.GetCachedUsers();

    let matchingUser = users.find(user => {
        return user.username === username;
    });

    return matchingUser;
}

exports.createUserIcon = function(number) {
    if(number !== undefined && !Number.isNaN(number)){
        return 'player_icon_' + number.toString();
    }
    else{
        return 'player_icon_' + Math.floor(Math.random()*NUMBER_OF_ICONS+1).toString();
    }
}