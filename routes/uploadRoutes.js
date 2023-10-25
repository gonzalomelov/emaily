const AWS = require('aws-sdk');
const keys = require('../config/keys');
const requireLogin = require('../middlewares/requireLogin');
const crypto = require('crypto');

const s3 = new AWS.S3({
  credentials: {
    accessKeyId: keys.s3AccessKeyId,
    secretAccessKey: keys.s3SecretAccessKey,
  },
  region: 'us-east-1',
});

module.exports = (app) => {
  app.get('/api/upload', requireLogin, async (req, res) => {
    const key = `${req.user._id}/${crypto.randomUUID()}.jpeg`;

    const url = await s3.getSignedUrlPromise('putObject', {
      Bucket: keys.s3Bucket,
      Key: key,
      ContentType: 'image/jpeg',
    });
    
    res.send({ key, url });
  })
};