import { Request, Response } from "express";
import db from "@db/db";
import { customer, phone_number } from "@db/schema";
import { createCustomerSchema } from "@type/api/customer";

const createCustomer = async (req: Request, res: Response) => {

  const createCustomerSchemaAnswer = createCustomerSchema.safeParse(req.body);

  if (!createCustomerSchemaAnswer.success){
    return res.status(400).json({success: false, message: createCustomerSchemaAnswer.error.flatten()})
  }

  try {

    const createdCustomer = await db.transaction(async (tx) => {

      const tCustomer = await tx.insert(customer).values({
        name: createCustomerSchemaAnswer.data.name,
        balance: createCustomerSchemaAnswer.data.balance,
      }).returning();

      await tx.insert(phone_number).values(
        createCustomerSchemaAnswer.data.phone_numbers.map((phone_number) => {
          return {
            customer_id: tCustomer[0].id,
            phone_number: phone_number.phone_number,
            country_code: phone_number.country_code,
            isPrimary: phone_number.isPrimary,
            whatsappChatId: phone_number.whatsappChatId
          };
        })
      )      
      return tCustomer[0];
    })
    
    return res.status(201).json({success: true, message: "Customer created successfully", data: createdCustomer});
  } catch (error) {
    return res.status(500).json({success: false, message: "Unable to create customer", error: error});
  }
}

const addAddress = async (req: Request, res: Response) => {
  
}
const editCustomer = async (req: Request, res: Response) => {}
const settleBalance = async (req: Request, res: Response) => {}
const getCustomer = async (req: Request, res: Response) => {}
const deleteCustomer = async (req: Request, res: Response) => {}
const getAllCustomers = async (req: Request, res: Response) => {}

export {
  createCustomer,
  addAddress,
  editCustomer,
  settleBalance,
  getCustomer,
  deleteCustomer,
  getAllCustomers  
}