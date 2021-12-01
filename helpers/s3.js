require('dotenv').config()
const AWS = require('aws-sdk');

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_KEY
});

module.exports.deleteS3Object = (key) => {
  const obj = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: key
  }
  try {
    s3.deleteObject(obj, (err, data) => {
      if(err) {
        return false
      }
      else {
        return true
      }
    })  
  } catch (error) {
    return false
  }
}