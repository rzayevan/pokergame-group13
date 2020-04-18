let Report = require("../model/Report.js");
const DataAccessLayer = require('../controllers/DataAccessLayer.js');
const UserUtils = require('./UserUtils.js');
const NUM_OF_MESSAGES = 5;

// If the report is valid, save it 
// Return true if the report was saved, false otherwise 
// TODO: remove hardcoded data 
exports.submitReport = function(reportData) {
    try {
        // TODO: Delete and replace with function to grab relevant chat data from the table
        let chatMessages = [];
        let chatMessageCache = DataAccessLayer.GetCachedMessages();
        let tableMessages = chatMessageCache.filter(x => x.tableID == reportData.roomID);

        // Sort tableMessages by descending sentDate
        tableMessages.sort(function(a, b) {
            a = new Date(a.sentDate);
            b = new Date(b.sentDate);
            return a > b ? -1 : a < b ? 1 : 0;
        });

        // If there are less than NUM_OF_MESSAGES at the table before the report use the number of messages, else use the constant
        let messagesToAdd = (tableMessages.length < NUM_OF_MESSAGES) ? tableMessages.length - 1 : NUM_OF_MESSAGES - 1;

        // Add the relevant tableMessages to chatMessages in the order they were sent
        for (let i = messagesToAdd; i >= 0; i--) {
            chatMessages.push(tableMessages[i]);
        }

        // TODO: Replace with the username of the offending user 
        let offendingUser = UserUtils.getUserByUsername(reportData.offenderUsername);
        // TODO: Replace with the username of the submitting user 
        let submittingUser = UserUtils.getUserById(reportData.reportingUser);
        
        // Create and save the new report
        let report = new Report();
        report.CreateNewReport(offendingUser, submittingUser, reportData.reportType, reportData.reportComment, chatMessages, "notreviewed");
        return DataAccessLayer.AddReportToFile(report);
    }
    catch (error) {
        return false;
    }
}

// Determine whether or not the report contains valid data
// TODO: check all report fields (ie. chat messages, submitting user)
isReportDataValid = function(reportData) {
    if (reportData.reportType === "") {
        return false;
    }
    if (reportData.reportComment === "") {
        return false;
    }
    if (reportData.offenderUsername === "") {
        return false;
    }
}

// Retrieves reports from cache and formats them for display in the Reports component 
exports.getReports = function() {
    let formattedReports = [];

    let reports = DataAccessLayer.getCachedReports();
    reports = orderReports(reports);
    reports.forEach(report => {
        let formattedReport = {
            id: report.id,
            "Offending User": (typeof UserUtils.getUserById(report.offendingUserId)) !== "undefined" ? UserUtils.getUserById(report.offendingUserId).username : "Unknown",
            "Submitted": formatDate(report.dateSubmitted),
            "Offense": report.reportType,
            "Reported By": (typeof UserUtils.getUserById(report.submittingUserId)) !== "undefined" ? UserUtils.getUserById(report.submittingUserId).username : "Unknown",
            "Description": report.reportComment,
            status: report.status,
            isReviewed: isReviewed(report.status),
            chatLogs: report.chatLogs
        };

        formattedReports.push(formattedReport);
    });

    return formattedReports;
}

// Dismisses or bans a report, and updates the text file 
exports.reviewReport = async function(updateData) {    
    let report = this.getReport(updateData.id);
    report.status = updateData.newStatus;

    await DataAccessLayer.UpdateReport(report);
}

/**
 * Orders reports by review status, then by submission date
 */
orderReports = function(reports) {
    let unreviewedReports = [];
    let reviewedReports = [];

    reports = reports.sort((reportA, reportB) => reportA.dateSubmitted - reportB.dateSubmitted);

    reports.forEach(report => {
        if (isReviewed(report.status)) {
            reviewedReports.push(report);
        }
        else {
            unreviewedReports.push(report);
        }
    });

    return unreviewedReports.concat(reviewedReports);
}

// Convert a Date object into a short date string, in the format MM/DD/YY
formatDate = function(date) {
    let month = date.getMonth() + 1;
    let day = date.getUTCDate();
    let year = date.getFullYear();

    if (month < 10) 
        month = "0" + month;
    if (day < 10) 
        day = "0" + day;

    return month + "/" + day + "/" + year;
};

// Returns false if a report is not reviewed, true otherwise 
isReviewed = function(status) {
    if (status === "notreviewed") {
        return false;
    }
    return true;
}

// Parses the report cache and returns the report with an ID matching the passed value 
exports.getReport = function(id) {
    let reports = DataAccessLayer.getCachedReports();

    let matchingReport = reports.find(report => {
        return report.id === id;
    });

    return matchingReport;
}