import { Request, Response } from "express";
import db from "@db/db";
import { address, customer, phone_number } from "@db/schema";
import { addAddressType, createCustomerType, editCustomerType } from "@type/api/customer";
import { eq } from "drizzle-orm";

const createCustomer = async (req: Request, res: Response) => {

  const createCustomerTypeAnswer = createCustomerType.safeParse(req.body);

  if (!createCustomerTypeAnswer.success){
    return res.status(400).json({success: false, message: "Input fields are not correct", error: createCustomerTypeAnswer.error.flatten()})
  }

  try {
    const createdCustomer = await db.transaction(async (tx) => {

      const tCustomer = await tx.insert(customer).values({
        name: createCustomerTypeAnswer.data.name,
        balance: createCustomerTypeAnswer.data.balance,
        profileUrl: createCustomerTypeAnswer.data.profileUrl
      }).returning();

      await tx.insert(phone_number).values(
        createCustomerTypeAnswer.data.phone_numbers.map((phone_number) => {
          return {
            customer_id: tCustomer[0].id,
            phone_number: phone_number.phone_number,
            country_code: phone_number.country_code,
            isPrimary: phone_number.isPrimary,
            whatsappChatId: phone_number.whatsappChatId
          };
        })
      )
      await tx.insert(address).values(
        createCustomerTypeAnswer.data.addresses.map((address) => {
          return {
            customer_id: tCustomer[0].id,
            address: address.address,
            city: address.city,
            state: address.state,
            pincode: address.pincode,
            isPrimary: address.isPrimary,
            latitude: address.latitude,
            longitude: address.longitude
          }
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
  const addAddressTypeAnswer = addAddressType.safeParse(req.body);

  if (!addAddressTypeAnswer.success){
    return res.status(400).json({success: false, message: "Input fields are not correct", error: addAddressTypeAnswer.error?.flatten()})
  }

  try {

    const tCustomer = await db.select({id: customer.id}).from(customer).where(eq(customer.id, addAddressTypeAnswer.data.customer_id));
    if(tCustomer.length === 0){
      return res.status(400).json({ success: false, message: "Customer not found" });
    }
    await db.transaction(async (tx) => {
      await tx.insert(address).values({
        customer_id: tCustomer[0].id,
        address: addAddressTypeAnswer.data.address,
        city: addAddressTypeAnswer.data.city,
        state: addAddressTypeAnswer.data.state,
        pincode: addAddressTypeAnswer.data.pincode,
        isPrimary: addAddressTypeAnswer.data.isPrimary,
        latitude: addAddressTypeAnswer.data.latitude,
        longitude: addAddressTypeAnswer.data.longitude
      });
    })

    return res.status(201).json({success: true, message: "Address added successfully"});
  } catch (error) {
    return res.status(500).json({success: false, message: "Unable to add address", error: error});
  }
}

const editCustomer = async (req: Request, res: Response) => {
  const editCustomerTypeAnswer = editCustomerType.safeParse(req.body);

  if (!editCustomerTypeAnswer.success){
    return res.status(400).json({success: false, message: "Input fields are not correct", error: editCustomerTypeAnswer.error?.flatten()})
  }

  try {
    
    const updatedCustomer = await db.transaction(async (tx) => {
      const tCustomer = await tx.select({id: customer.id}).from(customer).where(eq(customer.id, editCustomerTypeAnswer.data.customer_id));

      if(tCustomer.length === 0){
        throw new Error("Customer not found");
      }

      const updatedTCustomer = await tx.update(customer).set({
        name: editCustomerTypeAnswer.data.name,
        balance: editCustomerTypeAnswer.data.balance,
        profileUrl: editCustomerTypeAnswer.data.profileUrl
      }).where(eq(customer.id, tCustomer[0].id)).returning();

      return updatedTCustomer[0];
    })

    return res.status(201).json({success: true, message: "Customer updated successfully", data: updatedCustomer});
  } catch (error) {
    return res.status(500).json({success: false, message: "Unable to update customer", error: error});
  }
};

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