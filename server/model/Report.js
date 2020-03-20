const uuid = require('uuid/v1');

class Report {
    // Creates a report
    constructor(offendingUser, submittingUser, reportType, reportComment, chatLogs) {
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
        // The previous 10 chat messages related to the report
        this.chatLogs = chatLogs;
        // Value stating whether the report has not been reviewed, dismissed, or banned ('notreviewed', 'dismissed', and 'banned' respectively)
        this.status = 'notreviewed';
    }
}

module.exports = Report;