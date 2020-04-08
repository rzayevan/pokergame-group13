const { v1: uuid } = require('uuid');

class Report {
    // Creates a report
    constructor() {
        // The uuid of the report
        this.id;
        // The uuid of the offendingUser
        this.offendingUserId;
        // The uuid of the submittingUser
        this.submittingUserId;
        // The type of report submitted
        this.reportType;
        // The comment attached to the report
        this.reportComment;
        // The date that the report was submitted
        this.dateSubmitted;
        // The date that the report was last updated
        this.lastUpdatedDate;
        // Value stating whether the report has not been reviewed, dismissed, or banned ('notreviewed', 'dismissed', and 'banned' respectively)
        this.status;
        // ID of the table report occurred at
        this.tableID;
        // The previous 5 chat messages related to the report
        this.chatLogs;
    }

    // Creates a report
    CreateNewReport(offendingUser, submittingUser, reportType, reportComment, chatLogs, status, tableID) {
        // The uuid of the report
        this.id = uuid();
        // The uuid of the offendingUser
        this.offendingUserId = offendingUser.id;
        // The uuid of the submittingUser
        this.submittingUserId = submittingUser.id;
        // The type of report submitted
        this.reportType = reportType;
        // The comment attached to the report
        this.reportComment = reportComment;
        // The date that the report was submitted
        this.dateSubmitted = new Date();
        // The date that the report was last updated
        this.lastUpdatedDate = new Date();
        // Value stating whether the report has not been reviewed, dismissed, or banned ('notreviewed', 'dismissed', and 'banned' respectively)
        this.status = status;
        // ID of the table report occurred at
        this.tableID = tableID;
        // The previous 5 chat messages related to the report
        this.chatLogs = chatLogs;
    }
}

module.exports = Report;