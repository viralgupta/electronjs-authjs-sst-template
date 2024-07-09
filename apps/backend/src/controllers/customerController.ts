import { Request, Response } from "express";
import db from "@db/db";
import { customer } from "@db/schema";
import { createCustomerSchema } from "@type/api/customer";

const createCustomer = async (req: Request, res: Response) => {

  const createCustomerSchemaAnswer = createCustomerSchema.safeParse(req.body);

  if (!createCustomerSchemaAnswer.success){
    return res.status(400).json({success: false, message: createCustomerSchemaAnswer.error.flatten()})
  }

  try {
    // const customer2 = await db.insert(customer).values({
    //   name,
    //   balance,
    // });
    
    return res.status(201).json({success: true, data: "customer"});
  } catch (error) {
    // return res.status(500).json({success: false, message: error.message});
  }

}
const addAddress = async (req: Request, res: Response) => {}
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