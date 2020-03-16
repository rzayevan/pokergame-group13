class User {
    // Creates an empty user
    constructor() {
         // The username of the user
         this.username;
         // The password of the user
         this.password;
         // The email of the user
         this.email;
         // The number of chips the user has
         this.chips;
         // The number of hands the user has won
         this.hands;
         // The last time this entry was updated
         this.lastUpdatedDate;
         // The time this entry was created
         this.createdDate;
    }

    // Creates a user with all fields populated
    CreateNewUser(username, password, email) {
        // The username of the user
        this.username = username;
        // The password of the user
        this.password = password;
        // The email of the user
        this.email = email;
        // The number of chips the user has
        this.chips = 100;
        // The number of hands the user has won
        this.hands = 0;
        // The last time this entry was updated
        this.lastUpdatedDate = new Date();
        // The time this entry was created
        this.createdDate = new Date();
    }
}

module.exports = User;