const AWS = require("aws-sdk");

const config = require("./environment");

const s3 = new AWS.S3({ apiVersion: "2006-03-01" });

module.exports.uploadToS3 = async function(Key, Body) {
  return await s3
    .putObject({ Bucket: config.s3Bucket, Key, Body, ContentType: "image/png" })
    .promise();
};
