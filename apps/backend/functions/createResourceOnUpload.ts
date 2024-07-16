import * as S3 from "@aws-sdk/client-s3"
import db from "@db/db";
import { resource } from "@db/schema";
import { createResourceOnUploadHandlerType } from "@type/api/miscellaneous";

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
    
    const createResourceOnUploadHandlerTypeAnswer = createResourceOnUploadHandlerType.safeParse(metaData);
    
    if (!createResourceOnUploadHandlerTypeAnswer.success) {
      console.error("Invalid metadata: ", createResourceOnUploadHandlerTypeAnswer.error.flatten());
      deleteObject(objectKey, bucketName, client);
      return;
    }

    await db.insert(resource).values({
      key: createResourceOnUploadHandlerTypeAnswer.data.key,
      name: createResourceOnUploadHandlerTypeAnswer.data.name,
      description: createResourceOnUploadHandlerTypeAnswer.data.description,
    })

  } catch (error) {
    console.log("Unable to create resource in db:", error);
    deleteObject(objectKey, bucketName, client);
  }

  return;
};


async function deleteObject(key: string, bucket: string, client: S3.S3Client) {
  const deleteObjectCommand = new S3.DeleteObjectCommand({
    Bucket: bucket,
    Key: key
  });

  try {
    await client.send(deleteObjectCommand);
  } catch (error: any) {
    console.error(error.message);
  }
    
}

export default createResourceOnUploadHandler;