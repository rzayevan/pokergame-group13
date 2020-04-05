const DataAccessLayer = require('../controllers/DataAccessLayer.js');
const NUMBER_OF_ICONS = 16;

/**
 * Checks if the provided credentials match the ones stored in the application
 */
exports.credentialsMatch = function(user) {
    let users = DataAccessLayer.GetCachedUsers();
    let matchFound = false;
    let userData = {};
    users.forEach(existingUser => {
        if (user.email.toLowerCase() === existingUser.email.toLowerCase() && user.password === existingUser.password) {
            matchFound = true;
            userData = existingUser;
        }
    });

    return {matchFound: matchFound, userData: userData};
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

exports.getUser = function(id) {
    let users = DataAccessLayer.GetCachedUsers();

    var matchingUser = users.find(user => {
        return user.id === id;
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