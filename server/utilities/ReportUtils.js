let Report = require("../model/Report.js");

const DataAccessLayer = require('../controllers/DataAccessLayer.js');
const UserUtils = require('./UserUtils.js');

exports.submitReport = function(reportData) {
    try {
        console.log(reportData);
        // TODO: Delete and replace with function to grab relevant chat data from the table
        let chatMessages = [];
        chatMessages.push({ username: "mack", message: "Jim you suck"});
        chatMessages.push({ username: "Jim", message: "Leave me alone"});
        chatMessages.push({ username: "mack", message: "No you suck"});
        chatMessages.push({ username: "mack", message: "You're a loser"});
        chatMessages.push({ username: "mack", message: "Idiot"});
    
        // TODO: Replace with the username of the offending user 
        let offendingUser = UserUtils.getUserByUsername("mack");
        // TODO: Replace with the username of the submitting user 
        let submittingUser = UserUtils.getUserByUsername("Jim");
    
        console.log(submittingUser);
    
        let report = new Report();
        report.CreateNewReport(offendingUser, submittingUser, reportData.reportType, reportData.reportComment, chatMessages, "notreviewed");
        console.log(report);
    
       return DataAccessLayer.AddReportToFile(report);
    }
    catch (error) {
        return false;
    }
    
}

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
    let report = getReport(updateData.id);
    report.status = updateData.newStatus;

    await DataAccessLayer.UpdateReport(report);
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
getReport = function(id) {
    let reports = DataAccessLayer.getCachedReports();

    let matchingReport = reports.find(report => {
        return report.id === id;
    });

    return matchingReport;
}