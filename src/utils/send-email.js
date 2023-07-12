const { parseRes, checkMetaAndStatus, checkDataPropertyExists, checkDataIsNotEmpty } = require('../utils/parse-res');

function sendEmail(vvClient, recipients = testEmails, subject, body) {
    const shortDescription = `Send email to ${recipients}. Time: ${new Date().toUTCString()}`;
    const emailObj = {
        recipients,
        subject,
        body,
    };

    return vvClient.email
        .postEmails(null, emailObj)
        .then((res) => parseRes(res))
        .then((res) => checkMetaAndStatus(res, shortDescription))
        .then((res) => checkDataPropertyExists(res, shortDescription))
        .then((res) => checkDataIsNotEmpty(res, shortDescription));
}

module.exports = sendEmail;
