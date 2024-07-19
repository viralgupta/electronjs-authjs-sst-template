import * as S3 from "@aws-sdk/client-s3"
import db from "@db/db";
import { resource } from "@db/schema";
import { removeResourceOnDeleteHandlerType } from "@type/api/miscellaneous";
import { eq } from "drizzle-orm";
import { Config } from "sst/node/config";

const removeResourceOnDeleteHandler = async (evt: any) => {
  const objectKey: string = evt.Records[0].s3.object.key;
  const bucket = evt.Records[0].s3.bucket.name;

  if(objectKey.endsWith("preview.png")) return;

  try {
    const removeResourceOnDeeHandlerTypeAnswer = removeResourceOnDeleteHandlerType.safeParse(objectKey);
    
    if (!removeResourceOnDeeHandlerTypeAnswer.success) {
      console.error("No Key Found in MetaData", removeResourceOnDeeHandlerTypeAnswer.error.flatten());
      return;
    }

    if(Config.STAGE === "dev") return;

    const s3 = new S3.S3Client({});

    const previewObjectKey = objectKey.split("/")[0].concat("/preview.png");

    const deleteObjectCommand = new S3.DeleteObjectCommand({
      Bucket: bucket,
      Key: previewObjectKey,
    });

    await s3.send(deleteObjectCommand);

    await db.delete(resource).where(eq(resource.key, removeResourceOnDeeHandlerTypeAnswer.data));

  } catch (error) {
    console.log("Unable to remove resource in DB: ", error);
  }

  return;
};

export default removeResourceOnDeleteHandler;