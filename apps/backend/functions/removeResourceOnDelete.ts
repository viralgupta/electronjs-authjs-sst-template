import * as S3 from "@aws-sdk/client-s3"
import db from "@db/db";
import { resource } from "@db/schema";
import { removeResourceOnDeleteHandlerType } from "@type/api/miscellaneous";
import { eq } from "drizzle-orm";

const removeResourceOnDeleteHandler = async (evt: any) => {
  const objectKey = evt.Records[0].s3.object.key;

  try {
    const removeResourceOnDeeHandlerTypeAnswer = removeResourceOnDeleteHandlerType.safeParse(objectKey);
    
    if (!removeResourceOnDeeHandlerTypeAnswer.success) {
      console.error("No Key Found in MetaData", removeResourceOnDeeHandlerTypeAnswer.error.flatten());
      return;
    }

    await db.delete(resource).where(eq(resource.key, removeResourceOnDeeHandlerTypeAnswer.data));

  } catch (error) {
    console.log("Unable to remove resource in DB: ", error);
  }

  return;
};

export default removeResourceOnDeleteHandler;