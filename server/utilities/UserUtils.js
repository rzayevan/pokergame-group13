const DataAccessLayer = require('../controllers/DataAccessLayer.js')

/**
 * Checks if the user
 */
exports.userMatched = function(user) {
    let users = DataAccessLayer.ReadUsersFile();
    let matchFound = false;

    users.forEach(existingUser => {
        if (user.email === existingUser.email && user.password === existingUser.password) {
            matchFound = true;
        }
    });

    return matchFound;
}