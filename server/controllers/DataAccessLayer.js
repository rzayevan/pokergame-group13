const fs = require('fs');
const lineReader = require('n-readlines');

let cachedUsers = [];

/**
 * Returns the array of user objects that are stored in the local text file
 */
exports.ReadUsersFile = function() {
    // Create a new LineReader object
    let liner = new lineReader('data/Users.txt');
    // Declare an empty variable line
    let line;
    // While line.next() is not false, set line to line.next() and parse it
    while (line = liner.next()) {
        // Convert the buffer recieved to an ascii string
        let lineString = line.toString('ascii');
        // Split the string by a semicolon
        let splitLine = lineString.split(';');
        // Create a user object based upon the line read
        let user = {
            username: splitLine[0],
            password: splitLine[1],
            email: splitLine[2],
            gold: splitLine[3]
        }
        // Add the user object to the cachedUsers array
        cachedUsers.push(user);
    }
    // return cachedUsers
    return cachedUsers;
}

/**
 * Adds the newly created user to the local text file
 */
exports.AddUserToFile = function(user) {
    // Create a string to store in the text file as a user
    let userString = user.username + ";" + user.password + ";" + user.email + ";" + user.gold + ";\n";
    // Append the string to the text file
    fs.appendFileSync('data/Users.txt', userString);
}