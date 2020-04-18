const fs = require('fs');
const lineReader = require('n-readlines');
const replace = require('replace-in-file');

let User = require("../model/User.js");
let Report = require("../model/Report.js");
let ChatMessage = require("../model/ChatMessage.js");
let ServerUtils = require("../utilities/ServerUtils.js");

const UserUtils = require('../utilities/UserUtils.js');
const ReportUtils = require('../utilities/ReportUtils.js');

let cachedUsers = [];
let cachedReports = [];
let cachedMessages = [];

/**
 * Retrieves the array of cached Reports
 */
exports.getCachedReports = function() {
    return cachedReports;
}

/**
 * Retrieves cached users
 */
exports.GetCachedUsers = function() {
    return cachedUsers;
}

/**
 * Retrieves cached messages
 */
exports.GetCachedMessages = function() {
    return cachedMessages;
}

/**
 * Returns the array of user objects that are stored in the local text file
 */
exports.ReadUsersFile = function() {
    // Reset Cached Users
    cachedUsers = [];
    // Create a new LineReader object
    let liner = new lineReader('data/Users.txt');
    // Declare an empty variable line
    let line;
    // While line.next() is not false, set line to line.next() and parse it
    while (line = liner.next()) {
        // Convert the buffer recieved to an ascii string
        let lineString = line.toString('ascii');
        // Split the string by a comma
        let splitLine = lineString.split(',');
        // Create a user object based upon the line read
        let user = new User();

        user.id = splitLine[0];
        user.socketID = splitLine[1];
        user.isLoggedIn = false;
        user.isAdmin = (splitLine[3] === 'true');
        user.username = splitLine[4];
        user.password = splitLine[5];
        user.email = splitLine[6];
        user.chips = parseInt(splitLine[7]);
        user.icon = splitLine[8];
        user.handsWon = parseInt(splitLine[9]);
        user.handsPlayed = parseInt(splitLine[10]);
        user.handsLost = user.handsPlayed - user.handsWon;
        user.lastUpdatedDate = new Date(splitLine[11]);
        user.lastLoggedInDate = new Date(splitLine[12]);
        user.createdDate = new Date(splitLine[13]);
        user.banned = (splitLine[14] === 'true');

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
    let userString = user.id + "," + user.socketID + "," + (user.isLoggedIn ? "true" : "false") + "," +
                    (user.isAdmin ? "true" : "false") + "," +
                     user.username + "," + user.password + "," + 
                     user.email + "," + user.chips + "," + user.icon + "," +
                     user.handsWon + "," + user.handsPlayed + "," + user.lastUpdatedDate.toISOString() + "," +
                     user.lastLoggedInDate + ',' +
                     user.createdDate.toISOString() + "," + user.banned + ",\n";
    // Append the string to the text file
    fs.appendFileSync('data/Users.txt', userString);
    // Add the User to the cache
    cachedUsers.push(user);
}

/**
 * Updates the cache and local text file to update to represent all changes made to the User object passed in
 * @param {User} user The User object that has had values updated, cache and local file will update based on id
 */
exports.UpdateUser = function(user) {
    // Find the index in the cache for the original User object
    let index = cachedUsers.findIndex(x => x.id === user.id);
    // Get a pointer to the original User object
    let originalUser = cachedUsers[index];
    // Create a string that will be searched for within the text file
    let originalUserStringRegex = ".*" + originalUser.id + ".*";

    // Create a new Date object to set the lastUpdatedDate's to
    let newLastUpdatedDate = new Date();

    // Create a new string to update the file to
    let newUserString = user.id + "," + user.socketID + "," + (user.isLoggedIn ? "true" : "false") + "," +
                        (user.isAdmin ? "true" : "false") + "," +
                        user.username + "," + user.password + "," + 
                        user.email + "," + user.chips + "," + user.icon + "," +
                        user.handsWon + "," + user.handsPlayed + "," + newLastUpdatedDate.toISOString() + "," +
                        user.lastLoggedInDate.toISOString() + ',' +
                        user.createdDate.toISOString() + "," + user.banned + ",";

    // Create a regexp to find the correct contents to change
    const regex = new RegExp(originalUserStringRegex, "g");

    // Create an options object for the replace function
    let replaceOptions = {
        files: "data/Users.txt",
        from: regex,
        to: newUserString
    }

    // Replace the relevant contents of the text file (replace-in-file node package)
    replace(replaceOptions)
        .then(result => {
            // If no error occurred and the result states that the file was successfully changed
            if (result.hasChanged) {
                // Update the cache
                user.handsLost = user.handsPlayed - user.handsWon;
                cachedUsers[index] = user;
                cachedUsers[index].lastUpdatedDate = newLastUpdatedDate;
            }
        })
        .catch(err => {
            // Log the error if the text file is not successfully updated
            console.log(err);
    });
}

/**
 * Returns a daily bonus object if the user is logging in on a new day
 */
exports.UserLoggedIn = function(userID){
    // check if the current day is different from the last logged in date
    // we check year month and day
    let user = cachedUsers.find(user => user.id === userID);
    if(user === undefined){ return null; }
    let lastDate = user.lastLoggedInDate;
    let currentDate = new Date();
    let lastDateYMD = lastDate.getFullYear().toString() + lastDate.getMonth().toString() + lastDate.getDate().toString();
    let currentDateYMD = currentDate.getFullYear().toString() + currentDate.getMonth().toString() + currentDate.getDate().toString();
    let result;
    if(lastDateYMD !== currentDateYMD){ // new day for log in, they get the daily bonus
        result = {
            accountChips: user.chips,
            dailyBonus: UserUtils.getDailyBonusValue(),
        }
    }
    else{
        result = {
            accountChips: user.chips,
            dailyBonus: 0,
        }
    }
    user.lastLoggedInDate = currentDate;
    this.UpdateUser(user);
    return result;
}

// Add daily bonus to user's chip value 
exports.AddUserDailyBonus = function(userId) {
    let user = UserUtils.getUserById(userId);
    if (user) {
        let dailyBonus = UserUtils.getDailyBonusValue()
        user.chips += dailyBonus;
        this.UpdateUser(user);
        return dailyBonus;
    }
    return 0;   
}

/**
 * Ban the offending user from a report
 */
exports.BanOffender = function(reportId) {
    let report = ReportUtils.getReport(reportId);
    if (report) {
        let user = UserUtils.getUserById(report.offendingUserId);
        if (user) {
            user.banned = true;
            this.UpdateUser(user);
        }
    } 
}

/*
 * Adds the supplied ChatMessage object to the cache
 * @param message The ChatMessage object to be added to the cache
 */
exports.AddMessageToCache = function(message) {
    cachedMessages.push(message);
    // If the cachedMessages array now has more than the maximum number allowed
    if (cachedMessages.length > ServerUtils.GetMaxChatMessages()) {
        // Removes the first element in the array
        cachedMessages.shift();
    }
}

/**
 * Returns the array of user objects that are stored in the local text file
 */
exports.ReadReportsFile = function() {
    // Reset CachedReports
    cachedReports = [];
    // Create a new LineReader object
    let liner = new lineReader('data/Reports.txt');
    // Declare an empty variable line
    let line;
    // While line.next() is not false, set line to line.next() and parse it
    while (line = liner.next()) {
        // Convert the buffer recieved to an ascii string
        let lineString = line.toString('ascii');

        // Split the string by three |
        // This allows for almost anything to be in the chat logs and not cause issues
        let splitLine = lineString.split('|||');
        // Create a Report object based upon the line read
        let report = new Report();
        report.id = splitLine[0];
        report.offendingUserId = splitLine[1];
        report.submittingUserId = splitLine[2];
        report.reportType = splitLine[3];
        report.reportComment = splitLine[4];
        report.dateSubmitted = new Date(splitLine[5]);
        report.lastUpdatedDate = new Date(splitLine[6]);
        report.status = splitLine[7];

        // Regex finds all strings within each instance of {}
        const regex = new RegExp("([^\{\}]|\{\})+", "g");

        // Find all the strings that match the given regex
        const chatMessages = splitLine[8].match(regex);
        // Declare an array for the chat messages
        let messages = [];

        // For each chat message
        for (let i = 0; i < chatMessages.length; i++) {
            // Filter and grab the username and message
            let userID = chatMessages[i].split(/,(.+)/)[0];
            let user = cachedUsers.find(x => x.id === userID);
            let message = chatMessages[i].split(/,(.+)/)[1];

            // Create a ChatMessage object with an empty tableID
            messages.push(new ChatMessage("", user, message));
        }

        // Add the chat logs to the report
        report.chatLogs = messages;
        // Add the Report object to the cachedReports array
        cachedReports.push(report);
    }
    return cachedReports;
}

/**
 * Adds the given Report to the local text file
 * @param {Report} report The supplied Report object to be added to the local text file
 */
exports.AddReportToFile = function(report) {
    // Gets the formatted string containing the chat logs
    let chatLogString = GetChatLogString(report.chatLogs);
    // Gets a new date for the lastUpdatedDate
    let newLastUpdatedDate = new Date();
    // Create a string to store in the text file as a Report
    let reportString = report.id + "|||" + report.offendingUserId + "|||" + 
                     report.submittingUserId + "|||" + report.reportType + "|||" + 
                     report.reportComment + "|||" + report.dateSubmitted.toISOString() + "|||" + 
                     newLastUpdatedDate.toISOString() + "|||" + report.status + "|||" + chatLogString + "|||\n";

    try {
        // Append the string to the text file
        fs.appendFileSync('data/Reports.txt', reportString);
        // Add the report to the cache
        cachedReports.push(report);
        
        return true;
    }
    catch (error) {
        return false;
    }
}

/**
 * Updates the cache and local text file to update to represent all changes made to the Report object passed in
 * @param {Report} report The Report object that has had values updated, cache and local file will update based on id
 */
exports.UpdateReport = async function(report) {
    // Find the index in the cache for the original User object
    let index = cachedReports.findIndex(x => x.id === report.id);
    // Get a pointer to the original User object
    let originalReport = cachedReports[index];

    // Create a regex that will be searched for within the text file
    let originalReportStringRegex = ".*" + originalReport.id + ".*";

    // Create a new Date object to set the lastUpdatedDate's of Report objects to.
    let newLastUpdatedDate = new Date();

    let newChatLogString = GetChatLogString(report.chatLogs);

    // Create a new string to update the file to.
    let newReportString = report.id + "|||" + report.offendingUserId + "|||" + 
                        report.submittingUserId + "|||" + report.reportType + "|||" + 
                        report.reportComment + "|||" + report.dateSubmitted.toISOString() + "|||" + 
                        newLastUpdatedDate.toISOString() + "|||" + report.status + "|||" + newChatLogString + "|||";

    // Create a regexp to find the correct contents to change
    const regex = new RegExp(originalReportStringRegex, "g");

    // Create an options object for the replace function
    let replaceOptions = {
        files: "data/Reports.txt",
        from: regex,
        to: newReportString
    }

    // Replace the relevant contents of the text file (replace-in-file node package)
    replace(replaceOptions)
        .then(result => {
            // If no error occurred and the result states that the file was successfully changed
            if (result.hasChanged) {
                // Update the cache
                cachedReports[index] = report;
                cachedReports[index].lastUpdatedDate = newLastUpdatedDate;
            }
        })
        .catch(err => {
            // Log the error if the text file is not successfully updated
            console.log(err);
    });
}

/**
 * Returns a string based on the supplied array of ChatMessages
 * @param {ChatMessage[]} chatMessages An array of ChatMessages that is supplied
 */
GetChatLogString = function(chatMessages) {
    let chatLogString = "";
    // For each ChatMessage in the given Report's chatLog
    for (let i = 0; i < chatMessages.length; i++) {
        // Create a unique string for the message
        let chatMessageString = "{" + chatMessages[i].userID + "," + chatMessages[i].message + "}";
        // Append the string to the chatLogString
        chatLogString += chatMessageString;
    }
    return chatLogString;
}