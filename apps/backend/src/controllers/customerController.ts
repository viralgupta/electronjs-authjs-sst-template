import { Request, Response } from "express";
import db from "@db/db";
import { address, customer, order, phone_number } from "@db/schema";
import { addAddressType, createCustomerType, deleteCustomerType, editCustomerType, getCustomerType, settleBalanceType } from "@type/api/customer";
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
            house_number: address.house_number,
            address_area_id: address.address_area_id,
            address: address.address,
            city: address.city,
            state: address.state,
            isPrimary: address.isPrimary,
            latitude: address.latitude,
            longitude: address.longitude
          }
        })
      )
      return tCustomer[0];
    })
    
    return res.status(200).json({success: true, message: "Customer created successfully", data: createdCustomer});
  } catch (error: any) {
    return res.status(400).json({success: false, message: "Unable to create customer", error: error.message ? error.message : error});
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
    await db.insert(address).values(
      addAddressTypeAnswer.data.addresses.map((address) => {
        return {
          customer_id: tCustomer[0].id,
          house_number: address.house_number,
          address_area_id: address.address_area_id,
          address: address.address,
          city: address.city,
          state: address.state,
          isPrimary: address.isPrimary,
          latitude: address.latitude,
          longitude: address.longitude
        }
      })
    );

    return res.status(200).json({success: true, message: "Address added successfully"});
  } catch (error: any) {
    return res.status(400).json({success: false, message: "Unable to add address", error: error.message ? error.message : error});
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
        profileUrl: editCustomerTypeAnswer.data.profileUrl
      }).where(eq(customer.id, tCustomer[0].id)).returning();

      return updatedTCustomer[0];
    })

    const  { ["total_order_value"]: _, ...updatedCustomerWithoutTotalOrderValue} = updatedCustomer;

    return res.status(200).json({success: true, message: "Customer updated successfully", data: updatedCustomerWithoutTotalOrderValue});
  } catch (error: any) {
    return res.status(400).json({success: false, message: "Unable to update customer", error: error.message ? error.message : error});
  }
};

const settleBalance = async (req: Request, res: Response) => {
  const settleBalanceTypeAnswer = settleBalanceType.safeParse(req.body);

  if (!settleBalanceTypeAnswer.success){
    return res.status(400).json({success: false, message: "Input fields are not correct", error: settleBalanceTypeAnswer.error?.flatten()})
  }

  try {
    
    const updatedCustomer = await db.transaction(async (tx) => {
      const tCustomer = await tx.select({id: customer.id, balance: customer.balance}).from(customer).where(eq(customer.id, settleBalanceTypeAnswer.data.customer_id));

      if(tCustomer.length === 0){
        throw new Error("Customer not found");
      }

      if(!tCustomer[0].balance){
        tCustomer[0].balance = "0.00";
      }

      const newBalance = settleBalanceTypeAnswer.data.operation == "add" 
        ? parseFloat(parseFloat(tCustomer[0].balance).toFixed(2)) + settleBalanceTypeAnswer.data.amount 
        : parseFloat(parseFloat(tCustomer[0].balance).toFixed(2)) - settleBalanceTypeAnswer.data.amount;

      const updatedTCustomer = await tx.update(customer).set({
        balance: newBalance.toFixed(2)
      }).where(eq(customer.id, tCustomer[0].id)).returning();

      return updatedTCustomer[0];
    })

    // remove total_order_value from response
    const  { ["total_order_value"]: _, ...updatedCustomerWithoutTotalOrderValue} = updatedCustomer;

    return res.status(200).json({success: true, message: "Balance updated successfully", data: updatedCustomerWithoutTotalOrderValue});
  } catch (error: any) {
    return res.status(400).json({success: false, message: "Unable to update balance", error: error.message ? error.message : error});
  }
}

const getCustomer = async (req: Request, res: Response) => {

  const getCustomerTypeAnswer = getCustomerType.safeParse(req.query);

  if (!getCustomerTypeAnswer.success){
    return res.status(400).json({success: false, message: "Input fields are not correct", error: getCustomerTypeAnswer.error?.flatten()})
  }

  try {

    let customer_id = getCustomerTypeAnswer.data.customer_id;
    let phone_no = getCustomerTypeAnswer.data.phone_number;

    if(phone_no){
      let phone_number_customer = await db.query.phone_number.findFirst({
        where: (phone_number, { eq }) => eq(phone_number.phone_number, phone_no),
        columns: {
          customer_id: true
        }
      })
      if(!phone_number_customer?.customer_id) return res.status(400).json({success: false, message: "Customer not found with this phone number"})
      customer_id = phone_number_customer.customer_id;
    }
    
    if(!customer_id) return res.status(400).json({success: false, message: "Customer ID or Phone Number is required"});

    const getCustomer = await db.query.customer.findFirst({
      where: (customer, { eq }) => eq(customer.id, customer_id),
      with: {
        addresses: {
          with: {
            address_area: {
              columns: {
                area: true
              }
            }
          },
          columns: {
            address: true,
            house_number: true,
            isPrimary: true,
            id: true
          }
        },
        phone_numbers: true,
        orders: {
          columns: {
            id: true,
            priority: true,
            status: true,
            payment_status: true,
            total_order_amount: true,
            amount_paid: true,
            created_at: true,
          },
          orderBy: (order, { desc }) => [desc(order.created_at)],
        },
        estimates: {
          columns: {
            id: true,
            total_estimate_amount: true,
            created_at: true,
          },
          orderBy: (estimate, { desc }) => [desc(estimate.created_at)],
        }
      },
      columns: {
        total_order_value: false
      }
    })

    if(!getCustomer){
      return res.status(400).json({success: false, message: "Customer not found"});
    }

    return res.status(200).json({success: true, data: getCustomer});
  } catch (error: any) {
    return res.status(400).json({success: false, message: "Unable to get customer", error: error.message ? error.message : error});
  }
}

const deleteCustomer = async (req: Request, res: Response) => {
  const deleteCustomerTypeAnswer = deleteCustomerType.safeParse(req.body);

  if (!deleteCustomerTypeAnswer.success){
    return res.status(400).json({success: false, message: "Input fields are not correct", error: deleteCustomerTypeAnswer.error?.flatten()})
  }

  try {
    await db.transaction(async (tx) => {

      const tCustomer = await tx.query.customer.findFirst({
        where: (customer, { eq }) => eq(customer.id, deleteCustomerTypeAnswer.data.customer_id),
        with: {
          orders: {
            where: (order, { or, isNotNull }) => or(
              isNotNull(order.architect_id),
              isNotNull(order.carpanter_id)
            ),
            limit: 1,
            columns: {
              id: true
            }
          }
        },
        columns: {
          id: true,
          balance: true
        }
      })
      
      if(!tCustomer){
        throw new Error("Customer not found");
      }
      
      if(tCustomer.balance && parseFloat(parseFloat(tCustomer.balance).toFixed(2)) > 0.00){
        throw new Error("Customer has balance pending, Settle Balance first!")
      }

      if(tCustomer.orders.length > 0){
        throw new Error("Customer has orders which are linked to Architect or Carpanters, cannot delete Customer!")
      }
      
      await tx.delete(customer).where(eq(customer.id, tCustomer.id));
    });

    return res.status(200).json({success: true, message: "Customer deleted successfully"});
  } catch (error: any) {
    return res.status(400).json({success: false, message: "Unable to delete customer", error: error.message ? error.message : error});
  }
}

const getAllCustomers = async (_req: Request, res: Response) => {

  try {
    const customers = await db.query.customer.findMany({
      columns: {
        name: true,
        balance: true,
      },
      with: {
        addresses: {
          with: {
            address_area: {
              columns: {
                area: true
              }
            }
          },
          columns: {
            house_number: true,
          },
          where: (address, { eq }) => eq(address.isPrimary, true),
          limit: 1
        },
      },
      orderBy: (customer, { desc }) => [desc(customer.balance)],
    });

    return res.status(200).json({success: true, message: "Customers found", data: customers});
  } catch (error: any) {
    return res.status(400).json({success: false, message: "Unable to get customers", error: error.message ? error.message : error});
  }
}

export {
  createCustomer,
  addAddress,
  editCustomer,
  settleBalance,
  getCustomer,
  deleteCustomer,
  getAllCustomers,
}