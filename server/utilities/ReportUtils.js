const DataAccessLayer = require('../controllers/DataAccessLayer.js');
const UserUtils = require('./UserUtils.js');

exports.getReports = function() {
    let formattedReports = [];

    let reports = DataAccessLayer.ReadReportsFile();
    console.log(reports.length);
    reports.forEach(report => {
        //console.log(count++);

        let formattedReport = {
            id: report.id,
            "Offending User": (typeof UserUtils.getUser(report.offendingUserId)) !== "undefined" ? UserUtils.getUser(report.offendingUserId).username : "Unknown",
            "Submitted": formatDate(report.dateSubmitted),
            "Reported By": (typeof UserUtils.getUser(report.submittingUserId)) !== "undefined" ? UserUtils.getUser(report.submittingUserId).username : "Unknown",
            "Description": report.reportComment,
            status: report.status,
            chatLogs: report.chatLogs
        };

        formattedReports.push(formattedReport);
    });

    return formattedReports;
}

formatDate = function(date) {
    let month = date.getMonth() + 1;
    let day = date.getUTCDate();
    let year = date.getFullYear();

    if (month < 10) 
        month = "0" + month;
    if (day < 10) 
        day = "0" + day;

    return month + "/" + day + "/" + year;
}