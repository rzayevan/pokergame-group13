const DataAccessLayer = require('../controllers/DataAccessLayer.js');
const UserUtils = require('./UserUtils.js');

// Retrieves reports from cache and formats them for display in the Reports component 
exports.getReports = function() {
    let formattedReports = [];

    let reports = DataAccessLayer.getCachedReports();
    reports.forEach(report => {
        let formattedReport = {
            id: report.id,
            "Offending User": (typeof UserUtils.getUser(report.offendingUserId)) !== "undefined" ? UserUtils.getUser(report.offendingUserId).username : "Unknown",
            "Submitted": formatDate(report.dateSubmitted),
            "Offense": report.reportType,
            "Reported By": (typeof UserUtils.getUser(report.submittingUserId)) !== "undefined" ? UserUtils.getUser(report.submittingUserId).username : "Unknown",
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
    var report = getReport(updateData.id);
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

    var matchingReport = reports.find(report => {
        return report.id === id;
    });

    return matchingReport;
}