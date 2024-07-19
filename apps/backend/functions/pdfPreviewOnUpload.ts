import * as S3 from "@aws-sdk/client-s3"
import db from "@db/db";
import { resource } from "@db/schema";
import { eq } from "drizzle-orm"
import fs from "fs"
import path from "path";
import { execSync } from "child_process";

const pdfPreviewOnUpload = async (key: string, Bucket: string, client: S3.S3Client,  body?: Uint8Array) => {

  if(!body) {
    console.error("No body found");
    return;
  }

  try {

    const convertedImage = await Convert(body);

    if(!typeof(convertedImage)) {
      console.error("Unable to convert image");
      return;
    }

    const PutObjectCommand = new S3.PutObjectCommand({
      Key: `${key.split("/")[0]}/preview.png`,
      Bucket: Bucket,
      Body: convertedImage
    })

    const response = await client.send(PutObjectCommand);

    if(response.$metadata.httpStatusCode === 200) {
      try {
        await db.update(resource).set({
          previewKey: `${key.split("/")[0]}/preview.png`
        }).where(eq(resource.key, key));
      } catch (error: any) {
        console.error("Unable to update preview in db:", error.message);
      } finally {
        return;
      }
    }

  } catch (error: any) {
    console.error("Unable to create preview", error);
  }

  return;
};

async function Convert(body: Uint8Array): Promise<Buffer> {
  return new Promise((resolve, reject) => {

    try {
      const dir = '/tmp';
      const inputname = path.join(dir, 'resource.pdf'); 
      const outputname = path.join(dir, 'preview.png');
      
      // Writing File
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      fs.writeFileSync(inputname, body);

      // Converting PDF to PNG
      execSync(`/opt/bin/gs -dQUIET -dPARANOIDSAFER -dBATCH -dNOPAUSE -dNOPROMPT -sDEVICE=png16m -dTextAlphaBits=4 -dGraphicsAlphaBits=4 -r100 -dFirstPage=1 -dLastPage=1 -sOutputFile=${outputname} ${inputname}`);

      // reading File
      const file = fs.readFileSync(outputname);
      resolve(file);
    } catch (error: any) {
      console.error("Error while Writing File:", error.message);
      reject(error.message);
    }
  });
}

export default pdfPreviewOnUpload;