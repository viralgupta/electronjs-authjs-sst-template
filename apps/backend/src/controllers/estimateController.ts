import db from '@db/db';
import { estimate, estimate_item } from '@db/schema';
import { createEstimateType, editEstimateType, findEstimateType } from '@type/api/estimate';
import { Request, Response } from "express";
import { eq } from 'drizzle-orm';

const createEstimate = async (req: Request, res: Response ) => {
  const createEstimateTypeAnswer = createEstimateType.safeParse(req.body);

  if (!createEstimateTypeAnswer.success){
    return res.status(400).json({success: false, message: "Input fields are not correct", error: createEstimateTypeAnswer.error.flatten()})
  }

  try {
    const createdEstimate = await db.transaction(async (tx) => {
      const total_estimate_value = (createEstimateTypeAnswer.data.items.reduce((acc, item) => acc + parseFloat(item.total_value), 0)).toFixed(2);

      const tcreatedEstimate = await tx.insert(estimate).values({
        customer_id: createEstimateTypeAnswer.data.customer_id,
        total_estimate_amount: total_estimate_value
      }).returning({
        id: estimate.id,
      })

      await tx.insert(estimate_item).values(
        createEstimateTypeAnswer.data.items.map((item) => {
          return {
            estimate_id: tcreatedEstimate[0].id,
            item_id: item.item_id,
            quantity: item.quantity,
            rate: item.rate,
            total_value: item.total_value
          }
        })
      );
      return tcreatedEstimate[0];
    })

    return res.status(200).json({success: true, message: "Estimate created successfully", data: createdEstimate});
  } catch (error: any) {
    return res.status(400).json({success: false, message: "Unable to create estimate", error: error.message ? error.message : error});
  }
}

const findEstimate = async (req: Request, res: Response ) => {
  const findEstimateTypeAnswer = findEstimateType.safeParse(req.query);

  if (!findEstimateTypeAnswer.success){
    return res.status(400).json({success: false, message: "Input fields are not correct", error: findEstimateTypeAnswer.error.flatten()})
  }

  try {
    const foundEstimate = await db.query.estimate.findFirst({
      where: (estimate, { eq }) => eq(estimate.id, findEstimateTypeAnswer.data.estimate_id),
      with: {
        customer: {
          columns: {
            id: true,
            name: true,
            profileUrl: true,
            balance: true
          },
          with: {
            phone_numbers: {
              where: (phone_number, { eq }) => eq(phone_number.isPrimary, true),
              columns: {
                country_code: true,
                phone_number: true,
              }
            }
          }
        },
        estimate_items: {
          columns: {
            quantity: true,
            rate: true,
            total_value: true
          },
          with: {
            item: {
              columns: {
                name: true,
                rate_dimension: true,
              }
            }
          }
        }
      }
    })

    if(!foundEstimate){
      return res.status(400).json({success: false, message: "Estimate not found"});
    }

    return res.status(200).json({success: true, message: "Estimate found", data: foundEstimate});
  } catch (error: any) {
    return res.status(400).json({success: false, message: "Unable to find estimate", error: error.message ? error.message : error});
  }
}

const editEstimate = async (req: Request, res: Response ) => {
  const editEstimateTypeAnswer = editEstimateType.safeParse(req.body);

  if (!editEstimateTypeAnswer.success){
    return res.status(400).json({success: false, message: "Input fields are not correct", error: editEstimateTypeAnswer.error.flatten()})
  }

  try {
    const editedEsitmateid = await db.transaction(async (tx) => {

      if(editEstimateTypeAnswer.data.customer_id){
        await tx.update(estimate).set({
          customer_id: editEstimateTypeAnswer.data.customer_id
        }).where(eq(estimate.id, editEstimateTypeAnswer.data.estimate_id));
      }

      editEstimateTypeAnswer.data.items.forEach(async (item) => {
        if(item.estimate_item_id){
          await tx.update(estimate_item).set({
            item_id: item.item_id,
            quantity: item.quantity,
            rate: item.rate,
            total_value: item.total_value
          }).where(eq(estimate_item.id, item.estimate_item_id))
        } else {
          await tx.insert(estimate_item).values({
            estimate_id: editEstimateTypeAnswer.data.estimate_id,
            item_id: item.item_id,
            quantity: item.quantity,
            rate: item.rate,
            total_value: item.total_value
          })
        }
      })

      return editEstimateTypeAnswer.data.estimate_id;
    })

    return res.status(200).json({success: true, message: "Estimate edited successfully", data: editedEsitmateid});
  } catch (error: any) {
    return res.status(400).json({success: false, message: "Unable to edit estimate", error: error.message ? error.message : error});
  }
}

export {
  createEstimate,
  findEstimate,
  editEstimate
}