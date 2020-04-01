const aws = require("aws-sdk");

let secrets;
if (process.env.NODE_ENV == "production") {
    secrets = process.env; // in prod the secrets are environment variables
} else {
    secrets = require("./secrets"); // in dev they are in secrets.json which is listed in .gitignore
}

const ses = new aws.SES({
    accessKeyId: secrets.AWS_KEY,
    secretAccessKey: secrets.AWS_SECRET,
    region: "eu-central-1"
});

exports.sendEmail = function(to, subject, message) {
    return ses
        .sendEmail({
            Source: "Christopher Liedtke <ggwoods@gmx.de>",
            Destination: {
                ToAddresses: [to]
            },
            Message: {
                Body: {
                    Text: {
                        Data: message
                    }
                },
                Subject: {
                    Data: subject
                }
            }
        })
        .promise()
        .then(() => console.log("Email successfully sent!"))
        .catch(err => console.log("Error in sendEmail() in ses.js", err));
};
