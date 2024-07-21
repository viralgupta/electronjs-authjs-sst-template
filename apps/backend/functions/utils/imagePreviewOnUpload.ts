import * as S3 from "@aws-sdk/client-s3"
import db from "@db/db";
import { resource } from "@db/schema";
import { eq } from "drizzle-orm"
import fs from "fs"
import path from "path";
import Jimp from "jimp";

const imagePreviewOnUpload = async (key: string, Bucket: string, client: S3.S3Client,  body?: Uint8Array) => {

  if(!body) {
    console.error("No body found");
    return;
  }

  try {

    const convertedImage = await Convert(body, key);

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

async function Convert(body: Uint8Array, key: string): Promise<Buffer> {
  return new Promise(async (resolve, reject) => {

    try {
      const dir = '/tmp';
      const inputname = path.join(dir, key.split("/")[1]); 
      const outputname = path.join(dir, 'preview.png');
      
      // Writing File
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      fs.writeFileSync(inputname, body);

      // Converting PDF to PNG
      await Jimp.read(inputname, (err, image) => {
        if(err) throw new Error("Error while reading the image using Jimp", err)

        return image.resize(330, Jimp.AUTO).quality(50).write(outputname, (err) => {
          if(err) throw new Error("Error while writing the image using Jimp", err)
            
          // reading File
          const file = fs.readFileSync(outputname);
          resolve(file);
        });
      }).catch((err) => {
        throw new Error("Error while converting the image", err)
      })

    } catch (error: any) {
      console.error("Error while Converting File:", error.message);
      reject(error.message);
    }
  });
}

export default imagePreviewOnUpload;