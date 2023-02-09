const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3')
const config = require('../../config/s3.js');


const s3 = new S3Client({
  forcePathStyle: config.forcePathStyle,
  region: config.region,
  credentials: {
    accessKeyId: config.accessKeyId,
    secretAccessKey: config.secretAccessKey,
  },
  endpoint: config.endpoint,
})

exports.put = async (file, key)=> {
  const result = await s3.send(
    new PutObjectCommand({
      Bucket: 'rnd-nodejs',
      Body: file,
      Key: key,
    })
  )
}