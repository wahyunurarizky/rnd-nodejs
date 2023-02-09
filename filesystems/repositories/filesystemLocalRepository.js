exports.put = async (file, key)=> {
  const result = await s3.send(
    new PutObjectCommand({
      Bucket: 'rnd-nodejs',
      Body: file,
      Key: key,
    })
  )
}