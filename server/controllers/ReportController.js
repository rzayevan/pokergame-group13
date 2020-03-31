const ReportUtils = require('../utilities/ReportUtils.js');

class ReportController {
    constructor() {}

    retrieveReports(socket, isUpdate) {
        let reportData = {
            reports: ReportUtils.getReports(),
            gridColumns: ["Offending User", "Submitted", "Offense", "Reported By"], 
        };

        if (isUpdate) {
            socket.broadcast.emit("receive reports", reportData);
        }
        else {
            socket.emit("receive reports", reportData);
        }
    }
}

module.exports = ReportController;