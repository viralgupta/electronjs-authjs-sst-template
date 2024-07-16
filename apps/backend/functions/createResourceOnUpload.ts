import * as S3 from "@aws-sdk/client-s3"

const createResourceOnUploadHandler = async (evt: any) => {
  const uploaderIP = evt.Records[0].requestParameters.sourceIPAddress
  const bucketName = evt.Records[0].s3.bucket.name;
  const objectKey = evt.Records[0].s3.object.key;

  const client = new S3.S3Client({});

  const getMetaDataCommand = new S3.HeadObjectCommand({
    Bucket: bucketName,
    Key: objectKey
  })

  try {
    
    const metaData = (await client.send(getMetaDataCommand)).Metadata;
    console.log(metaData);

  } catch (error) {
    
    console.log(error);
  }


  return {
    statusCode: 200,
  };
};

export default createResourceOnUploadHandler;