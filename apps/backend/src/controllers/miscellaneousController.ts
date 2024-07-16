import db from "@db/db";
import { phone_number } from "@db/schema";
import { createPhoneType, createPutSignedURLType, deletePhoneType, editPhoneType } from "@type/api/miscellaneous";
import { Request, Response } from "express";
import { and, eq } from "drizzle-orm";
import * as S3 from "@aws-sdk/client-s3"
import { Bucket } from "sst/node/bucket";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const createPhone = async (req: Request, res: Response) => {
  const createPhoneTypeAnswer = createPhoneType.safeParse(req.body);

  if (!createPhoneTypeAnswer.success) {
    return res.status(400).json({success: false, message: "Input fields are not correct", error: createPhoneTypeAnswer.error.flatten()})
  }

  try {

    const createdPhone = await db.transaction(async (tx) => {
      if(createPhoneTypeAnswer.data.isPrimary){
        await tx.update(phone_number).set({isPrimary: false}).where(
          createPhoneTypeAnswer.data.customer_id
          ? and(
              eq(phone_number.customer_id, createPhoneTypeAnswer.data.customer_id),
              eq(phone_number.isPrimary, true)
            )
          : createPhoneTypeAnswer.data.architect_id
          ? and(
              eq(phone_number.architect_id, createPhoneTypeAnswer.data.architect_id),
              eq(phone_number.isPrimary, true)
            )
          : createPhoneTypeAnswer.data.carpanter_id
          ? and(
              eq(phone_number.carpanter_id, createPhoneTypeAnswer.data.carpanter_id),
              eq(phone_number.isPrimary, true)
            )
          : createPhoneTypeAnswer.data.driver_id
          ? and(
              eq(phone_number.driver_id, createPhoneTypeAnswer.data.driver_id),
              eq(phone_number.isPrimary, true)
            )
          : undefined
        );
      } else if (createPhoneTypeAnswer.data.isPrimary == false || createPhoneTypeAnswer.data.isPrimary == undefined){
        // check if there is a primary phone number, if not make this one primary

        const foundPhone = await tx.query.phone_number.findFirst({
          where: (phone_number, { eq, and }) => {
            if(createPhoneTypeAnswer.data.customer_id){
              return and(
                eq(phone_number.customer_id, createPhoneTypeAnswer.data.customer_id),
                eq(phone_number.isPrimary, true)
              )
            } else if(createPhoneTypeAnswer.data.architect_id){
              return and(
                eq(phone_number.architect_id, createPhoneTypeAnswer.data.architect_id),
                eq(phone_number.isPrimary, true)
              )
            } else if(createPhoneTypeAnswer.data.carpanter_id){
              return and(
                eq(phone_number.carpanter_id, createPhoneTypeAnswer.data.carpanter_id),
                eq(phone_number.isPrimary, true)
              )
            } else if(createPhoneTypeAnswer.data.driver_id){
              return and(
                eq(phone_number.driver_id, createPhoneTypeAnswer.data.driver_id),
                eq(phone_number.isPrimary, true)
              )
            }
          },
          columns: {
            isPrimary: true
          }
        })

        if(!foundPhone){
          createPhoneTypeAnswer.data.isPrimary = true;
        }
      }

      return await tx.insert(phone_number).values(createPhoneTypeAnswer.data).returning();
    })
    
    
    return res.status(200).json({success: true, message: "Phone number added", data: createdPhone});
  } catch (error: any) {
    return res.status(400).json({success: false, message: "Unable to add phone number", error: error.message ? error.message : error});
  }
}

const editPhone = async (req: Request, res: Response) => {
  const editPhoneTypeAnswer = editPhoneType.safeParse(req.body);

  if (!editPhoneTypeAnswer.success) {
    return res.status(400).json({success: false, message: "Input fields are not correct", error: editPhoneTypeAnswer.error.flatten()})
  }

  try {
    const editedPhone = await db.transaction(async (tx) => {
      if(editPhoneTypeAnswer.data.isPrimary == true){

        await tx.update(phone_number).set({isPrimary: false}).where(
          editPhoneTypeAnswer.data.customer_id
          ? and(
              eq(phone_number.customer_id, editPhoneTypeAnswer.data.customer_id),
              eq(phone_number.isPrimary, true)
            )
          : editPhoneTypeAnswer.data.architect_id
          ? and(
              eq(phone_number.architect_id, editPhoneTypeAnswer.data.architect_id),
              eq(phone_number.isPrimary, true)
            )
          : editPhoneTypeAnswer.data.carpanter_id
          ? and(
              eq(phone_number.carpanter_id, editPhoneTypeAnswer.data.carpanter_id),
              eq(phone_number.isPrimary, true)
            )
          : editPhoneTypeAnswer.data.driver_id
          ? and(
              eq(phone_number.driver_id, editPhoneTypeAnswer.data.driver_id),
              eq(phone_number.isPrimary, true)
            )
          : undefined
        );
      } else if (editPhoneTypeAnswer.data.isPrimary == false){
        const foundPhone = await tx.query.phone_number.findFirst({
          where: (phone_number, { eq }) => eq(phone_number.id, editPhoneTypeAnswer.data.phone_number_id),
          columns: {
            isPrimary: true
          }
        })

        if(!foundPhone){
          return new Error("Phone number not found")
        }

        if(foundPhone.isPrimary === true){
          return new Error("At least one phone number should be primary")
        }
      }

      const {"phone_number_id": _, ...dataToUpdate} = editPhoneTypeAnswer.data;

      return await tx.update(phone_number).set(dataToUpdate).where(eq(phone_number.id, editPhoneTypeAnswer.data.phone_number_id)).returning();
    })
    
    return res.status(200).json({success: true, message: "Phone number edited", data: editedPhone});
  } catch (error: any) {
    return res.status(400).json({success: false, message: "Unable to edit phone number", error: error.message ? error.message : error});
  }
}

const deletePhone = async (req: Request, res: Response) => {
  const deletePhoneTypeAnswer = deletePhoneType.safeParse(req.body);

  if (!deletePhoneTypeAnswer.success) {
    return res.status(400).json({success: false, message: "Input fields are not correct", error: deletePhoneTypeAnswer.error.flatten()})
  }

  try {
    await db.transaction(async (tx) => {

      const foundPhone = await tx.query.phone_number.findFirst({
        where: (phone_number, { eq }) => eq(phone_number.id, deletePhoneTypeAnswer.data.phone_number_id),
        columns: {
          isPrimary: true,
          customer_id: true,
          architect_id: true,
          carpanter_id: true,
          driver_id: true
        }
      })

      if(!foundPhone){
        return new Error("Phone number not found")
      }

      if(foundPhone.isPrimary === true){
        // try to find another phone number and make it primary

        await tx.update(phone_number).set({isPrimary: true}).where(
          foundPhone.customer_id
          ? and(
              eq(phone_number.customer_id, foundPhone.customer_id),
              eq(phone_number.isPrimary, false)
            )
          : foundPhone.architect_id
          ? and(
              eq(phone_number.architect_id, foundPhone.architect_id),
              eq(phone_number.isPrimary, false)
            )
          : foundPhone.carpanter_id
          ? and(
              eq(phone_number.carpanter_id, foundPhone.carpanter_id),
              eq(phone_number.isPrimary, false)
            )
          : foundPhone.driver_id
          ? and(
              eq(phone_number.driver_id, foundPhone.driver_id),
              eq(phone_number.isPrimary, false)
            )
          : undefined
        )
      }

      await tx.delete(phone_number).where(eq(phone_number.id, deletePhoneTypeAnswer.data.phone_number_id));
    })
    
    return res.status(200).json({success: true, message: "Phone number deleted"});
  } catch (error: any) {
    return res.status(400).json({success: false, message: "Unable to delete phone number", error: error.message ? error.message : error});
  };
}

const createPutSignedURL = async (req: Request, res: Response) => {
  const createPutSignedURLTypeAnswer = createPutSignedURLType.safeParse(req.body);

  if (!createPutSignedURLTypeAnswer.success) {
    return res.status(400).json({success: false, message: "Input fields are not correct", error: createPutSignedURLTypeAnswer.error.flatten()})
  }

  try {
    const key = `${crypto.randomUUID()}.${createPutSignedURLTypeAnswer.data.extension.toLowerCase()}`;

    const command = new S3.PutObjectCommand({
      ACL: "private",
      Key: key,
      Bucket: Bucket.ResourceBucket.bucketName,
      Metadata: {
        "Name": createPutSignedURLTypeAnswer.data.name,
        "Description": createPutSignedURLTypeAnswer.data.description ?? "",
        "Key": key
      }
    });

    const url = await getSignedUrl(new S3.S3Client({}), command, {
      expiresIn: 60 * 10, // 10 minutes
    });

    return res.status(200).json({success: true, message: "PUT Signed URL created", data: url});
  } catch (error: any) {
    return res.status(400).json({success: false, message: "Unable to create signed URL", error: error.message ? error.message : error});
  }
}

const createGetSignedURL = async (req: Request, res: Response) => {
  // const createSignedURLTypeAnswer = createSignedURLType.safeParse(req.body);

  // if (!createSignedURLTypeAnswer.success) {
  //   return res.status(400).json({success: false, message: "Input fields are not correct", error: createSignedURLTypeAnswer.error.flatten()})
  // }

  try {


    return res.status(200).json({success: true, message: "GET Signed URL created", data: "signedUrl"});
  } catch (error: any) {
    return res.status(400).json({success: false, message: "Unable to create signed URL", error: error.message ? error.message : error});
  }
}

export {
  createPhone,
  editPhone,
  deletePhone,
  createPutSignedURL,
  createGetSignedURL,
}