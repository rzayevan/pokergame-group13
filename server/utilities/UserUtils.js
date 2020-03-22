const DataAccessLayer = require('../controllers/DataAccessLayer.js')

/**
 * Checks if the user
 */
exports.isExistingUser = function(user) {
    let users = DataAccessLayer.ReadUsersFile();
    let matchFound = false;

    users.forEach(existingUser => {
        if (user.email.toLowerCase() === existingUser.email.toLowerCase() && user.password === existingUser.password) {
            matchFound = true;
        }
    });

    return matchFound;
}