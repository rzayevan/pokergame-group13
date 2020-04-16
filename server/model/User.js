const { v1: uuid } = require('uuid');

class User {
    // Creates an empty user
    constructor() {
        // The uuid of the user
        this.id;
        // The socketID of the user
        this.socketID;
        // A boolean stating whether the user is logged in or not
        this.isLoggedIn;
        // A boolean stating whether the user is an Admin or not
        this.isAdmin;
        // The username of the user
        this.username;
        // The password of the user
        this.password;
        // The email of the user
        this.email;
        // The number of chips the user has
        this.chips;
        // The image icon name of the user
        this.icon;
        // The number of hands the user has won
        this.handsWon;
        // The number of hands the user has lost
        this.handsLost;
        // The number of hands the user has played
        this.handsPlayed;
        // The last time this entry was updated
        this.lastUpdatedDate;
        // The last time this entry was logged in
        this.lastLoggedInDate;
        // The time this entry was created
        this.createdDate;
        // Wether or not the user is banned
        this.banned;
    }

    // Populates the fields of a newly created User object
    CreateNewUser(username, password, email, icon, isAdmin = false) {
        // The uuid of the user
        this.id = uuid();
        // The socketID of the user
        this.socketID = "";
        // A boolean stating whether the user is logged in or not
        this.isLoggedIn = false;
        // A boolean stating whether the user is an Admin or not
        this.isAdmin = isAdmin;
        // The username of the user
        this.username = username;
        // The password of the user
        this.password = password;
        // The email of the user
        this.email = email;
        // The number of chips the user has
        this.chips = 100;
        // The image icon name of the user
        this.icon = icon;
        // The number of hands the user has won
        this.handsWon = 0;
        // The number of hands the user has lost
        this.handsLost = 0;
        // The number of hands the user has played
        this.handsPlayed = 0;
        // The last time this entry was updated
        this.lastUpdatedDate = new Date();
        // The last time this entry was logged in
        this.lastLoggedInDate = new Date();
        // The time this entry was created
        this.createdDate = new Date();
        // Wether or not the user is banned
        this.banned = false;
    }

    /**
     * Copies the values of a User object into this User object
     * @param {User} userToCopy The user that is being copied into this User object
     */
    CopyUser(userToCopy) {
        // The id of the user
        this.id = userToCopy.id;
        // The socketID of the user
        this.socketID = userToCopy.socketID;
        // A boolean stating whether the user is logged in or not
        this.isLoggedIn = userToCopy.isLoggedIn;
        // A boolean stating whether the user is an Admin or not
        this.isAdmin = userToCopy.isAdmin;
        // The username of the user
        this.username = userToCopy.username;
        // The password of the user
        this.password = userToCopy.password;
        // The email of the user
        this.email = userToCopy.email;
        // The number of chips the user has
        this.chips = userToCopy.chips;
        // The image icon name of the user
        this.icon = userToCopy.icon;
        // The number of hands the user has won
        this.handsWon = userToCopy.handsWon;
        // The number of hands the user has lost
        this.handsPlayed = userToCopy.handsLost;
        // The number of hands the user has played
        this.handsPlayed = userToCopy.handsPlayed;
        // The last time this entry was updated
        this.lastUpdatedDate = userToCopy.lastUpdatedDate;
        // The last time this entry was logged in
        this.lastLoggedInDate;
        // The time this entry was created
        this.createdDate = userToCopy.createdDate;
        // Wether or not the user is banned
        this.banned = false;
    }
}

module.exports = User;