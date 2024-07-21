import * as S3 from "@aws-sdk/client-s3"
import db from "@db/db";
import { resource } from "@db/schema";
import { createResourceOnUploadHandlerType } from "@type/functions/miscellaneous";
import pdfPreviewOnUpload from "./utils/pdfPreviewOnUpload";
import imagePreviewOnUpload from "./utils/imagePreviewOnUpload";
import { Config } from "sst/node/config";

const createResourceOnUploadHandler = async (evt: any) => {
  // const uploaderIP = evt.Records[0].requestParameters.sourceIPAddress
  const bucketName = evt.Records[0].s3.bucket.name;
  const objectKey = evt.Records[0].s3.object.key;

  if(objectKey.endsWith("preview.png")) return;

  const client = new S3.S3Client({});

  const getObjectCommand = new S3.GetObjectCommand({
    Bucket: bucketName,
    Key: objectKey
  })

  try {
    const object = (await client.send(getObjectCommand));
    
    const createResourceOnUploadHandlerTypeAnswer = createResourceOnUploadHandlerType.safeParse(object.Metadata);
    
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

    if(createResourceOnUploadHandlerTypeAnswer.data.key.endsWith("pdf")) {
      if(Config.STAGE === "dev") return;
      await pdfPreviewOnUpload(createResourceOnUploadHandlerTypeAnswer.data.key, bucketName, client, await object.Body?.transformToByteArray());    
    }

    if(createResourceOnUploadHandlerTypeAnswer.data.key.endsWith("jpg") || createResourceOnUploadHandlerTypeAnswer.data.key.endsWith("jpeg") || createResourceOnUploadHandlerTypeAnswer.data.key.endsWith("png")) {
      await imagePreviewOnUpload(createResourceOnUploadHandlerTypeAnswer.data.key, bucketName, client, await object.Body?.transformToByteArray());    
    }

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