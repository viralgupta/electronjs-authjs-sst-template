import db from '@db/db';
import { customer, item, order, order_item, phone_number } from '@db/schema';
import { createOrderType, getAllOrdersType, getOrderType } from '@type/api/order';
import { Request, Response } from "express";
import { calculatePaymentStatus } from '@utils/order';
import { eq, sql, lt } from "drizzle-orm"

const createOrder = async (req: Request, res: Response) => {
  const createOrderTypeAnswer = createOrderType.safeParse(req.body);

  if(!createOrderTypeAnswer.success){
    return res.status(400).json({success: false, message: "Input fields are not correct", error: createOrderTypeAnswer.error.flatten()})
  }

  try {
    const calculateCarpanterCommision = createOrderTypeAnswer.data.carpanter_id ? true : false;
    const calculateArchitectCommision = createOrderTypeAnswer.data.architect_id ? true : false;

    const createdOrder = await db.transaction(async (tx) => {

      // update all the quantities of the items and return the updated quantities
      const quantities: {id: string, quantity: number}[] = [];
      createOrderTypeAnswer.data.order_items.forEach(async (orderitem) => {
        const foundTItem = await tx.update(item).set({
          quantity: sql`${item.quantity} - ${sql.placeholder('orderQuantity')}`
        })
        .where(eq(item.id, orderitem.item_id))
        .returning({
          id: item.id,
          quantity: item.quantity
        })
        .execute({ orderQuantity: orderitem.quantity });

        if(!foundTItem[0]) {
          throw new Error("Item not found")
        }

        quantities.push(foundTItem[0]);
      })

      // calculate the total value of the order
      const totalValue = createOrderTypeAnswer.data.order_items.reduce((acc, orderitem, _index) => {
        return acc + parseFloat(orderitem.total_value);
      }, 0);
      const actualtotalValue = totalValue - parseFloat(createOrderTypeAnswer.data.discount ?? "0.00");

      // calcualate customer balance
      const customerBalance = actualtotalValue - parseFloat(createOrderTypeAnswer.data.amount_paid ?? "0.00")

      if(customerBalance > 0 && !createOrderTypeAnswer.data.customer_id){
        throw new Error("Order with due payment cannot be created without Customer Details!!!");
      }
      
      // calculate the commision of the carpanter
      const carpanterCommision = createOrderTypeAnswer.data.order_items.reduce((acc, orderitem, _index) => {
        return acc + parseFloat(orderitem.carpanter_commision ?? "0.00");
      }, 0).toFixed(2);

      // calculate the commision of the architect
      const architectCommision = createOrderTypeAnswer.data.order_items.reduce((acc, orderitem, _index) => {
        return acc + parseFloat(orderitem.architect_commision ?? "0.00");
      }, 0).toFixed(2);

      // calculate order status
      const orderStatus = quantities.some(quantity => quantity.quantity < 0) ? "Pending" : createOrderTypeAnswer.data.status;


      // create order
      const tOrder = await tx.insert(order).values({
        note: createOrderTypeAnswer.data.note,
        customer_id: createOrderTypeAnswer.data.customer_id,
        carpanter_id: createOrderTypeAnswer.data.carpanter_id,
        architect_id: createOrderTypeAnswer.data.architect_id,
        driver_id: createOrderTypeAnswer.data.driver_id,
        status: orderStatus,
        priority: createOrderTypeAnswer.data.priority,
        payment_status: calculatePaymentStatus(actualtotalValue, parseFloat(createOrderTypeAnswer.data.amount_paid ?? "0.00")),
        delivery_date: createOrderTypeAnswer.data.delivery_date,
        delivery_address_id: createOrderTypeAnswer.data.delivery_address_id,
        labour_frate_cost: createOrderTypeAnswer.data.labour_frate_cost,
        discount: createOrderTypeAnswer.data.discount,
        amount_paid: createOrderTypeAnswer.data.amount_paid,
        total_order_amount: totalValue.toFixed(2),
        carpanter_commision: calculateCarpanterCommision ? carpanterCommision : null,
        architect_commision: calculateArchitectCommision ? architectCommision : null,
      }).returning({id: order.id})

      // create order items
      await tx.insert(order_item).values(
        createOrderTypeAnswer.data.order_items.map((order_item) => {
          return {
            order_id: tOrder[0].id,
            item_id: order_item.item_id,
            quantity: order_item.quantity,
            rate: order_item.rate,
            total_value: order_item.total_value,
            carpanter_commision: order_item.carpanter_commision,
            carpanter_commision_type: order_item.carpanter_commision_type,
            architect_commision: order_item.architect_commision,
            architect_commision_type: order_item.architect_commision_type,
          }
        })
      )

      // update total order value and balance for customer
      if(createOrderTypeAnswer.data.customer_id) {
        await tx
          .update(customer)
          .set({
            balance: sql`${customer.balance} + ${sql.placeholder("customerBalance")}`,
            total_order_value: sql`${customer.total_order_value} + ${sql.placeholder("totalOrderValue")}`,
          })
          .where(eq(customer.id, createOrderTypeAnswer.data.customer_id))
          .execute({ customerBalance: customerBalance.toFixed(2), totalOrderValue: actualtotalValue.toFixed(2) });
      }

      return tOrder[0].id;
    })

    return res.status(200).json({success: true, message: "Order created successfully", data: createdOrder});
  } catch (error: any) {
    return res.status(400).json({success: false, message: "Unable to create order", error: error.message ? error.message : error});
  }

}

const editOrder = async (req: Request, res: Response) => {

}

const getAllOrders = async (req: Request, res: Response) => {
  const getAllOrdersTypeAnswer = getAllOrdersType.safeParse(req.body);

  if(!getAllOrdersTypeAnswer.success) {
    return res.status(400).json({success: false, message: "Input fields are not correct", error: getAllOrdersTypeAnswer.error.flatten()})
  }

  try {
    const fetchedOrders = db.transaction(async (tx) => {
       const tOrders = tx.query.order.findMany({
         limit: 10,
         where(order, { lt, eq, and }) {
           if (!getAllOrdersTypeAnswer.data.filter) {
             if (getAllOrdersTypeAnswer.data.cursor) {
               return lt(order.updated_at, getAllOrdersTypeAnswer.data.cursor);
             } else {
               return undefined;
             }
           } else {
             switch (getAllOrdersTypeAnswer.data.filter) {
              case "Status-Pending":
                if(getAllOrdersTypeAnswer.data.cursor){
                  return and(lt(order.updated_at, getAllOrdersTypeAnswer.data.cursor), eq(order.status, "Pending"))
                } else {
                  return eq(order.status, "Pending")
                }
              case "Status-Delivered":
                if(getAllOrdersTypeAnswer.data.cursor){
                  return and(lt(order.updated_at, getAllOrdersTypeAnswer.data.cursor), eq(order.status, "Delivered"))
                } else {
                  return eq(order.status, "Delivered")
                }
              case "Payment-UnPaid":
                if(getAllOrdersTypeAnswer.data.cursor){
                  return and(lt(order.updated_at, getAllOrdersTypeAnswer.data.cursor), eq(order.payment_status, "UnPaid"))
                } else {
                  return eq(order.payment_status, "UnPaid")
                }
              case "Payment-Partial":
                if(getAllOrdersTypeAnswer.data.cursor){
                  return and(lt(order.updated_at, getAllOrdersTypeAnswer.data.cursor), eq(order.payment_status, "Partial"))
                } else {
                  return eq(order.payment_status, "Partial")
                }
              case "Payment-Paid":
                if(getAllOrdersTypeAnswer.data.cursor){
                  return and(lt(order.updated_at, getAllOrdersTypeAnswer.data.cursor), eq(order.payment_status, "Paid"))
                } else {
                  return eq(order.payment_status, "Paid")
                }
              case "Priority-Low":
                if(getAllOrdersTypeAnswer.data.cursor){
                  return and(lt(order.updated_at, getAllOrdersTypeAnswer.data.cursor), eq(order.priority, "Low"))
                } else {
                  return eq(order.priority, "Low")
                }
              case "Priority-Medium":
                if(getAllOrdersTypeAnswer.data.cursor){
                  return and(lt(order.updated_at, getAllOrdersTypeAnswer.data.cursor), eq(order.priority, "Medium"))
                } else {
                  return eq(order.priority, "Medium")
                }
              case "Priority-High":
                if(getAllOrdersTypeAnswer.data.cursor){
                  return and(lt(order.updated_at, getAllOrdersTypeAnswer.data.cursor), eq(order.priority, "High"))
                } else {
                  return eq(order.priority, "High")
                }
              default:
                undefined;
                break;
             }
           }
         },
         orderBy: (order, { desc }) => [desc(order.updated_at)],
         columns: {
           status: true,
           payment_status: true,
           priority: true,
           updated_at: true,
         },
         with: {
           delivery_address: {
             columns: {
               house_number: true,
               address: true,
             },
           },
           customer: {
             columns: {
               name: true,
             },
           },
         },
       });
       return tOrders;
    })

    return res.status(200).json({success: true, message: "Orders fetched successfully", data: fetchedOrders});
  } catch (error: any) {
    return res.status(400).json({success: false, message: "Unable to fetch orders", error: error.message ? error.message : error});
  }
}

const getOrder = async (req: Request, res: Response) => {
  const getOrderTypeAnswer = getOrderType.safeParse(req.body);

  if(!getOrderTypeAnswer.success) {
    return res.status(400).json({success: false, message: "Input fields are not correct", error: getOrderTypeAnswer.error.flatten()})
  }

  try {
    const fetchedOrder = db.transaction(async (tx) => {
      const tOrder = await db.query.order.findFirst({
        where: (order, { eq }) =>
          eq(order.id, getOrderTypeAnswer.data.order_id),
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
                  phone_number: true
                }
              }
            }
          },
          architect: {
            columns: {
              name: true,
              profileUrl: true
            }
          },
          carpanter: {
            columns: {
              name: true,
              profileUrl: true
            }
          },
          driver: {
            columns: {
              name: true,
              vehicle_number: true
            },
            with: {
              phone_numbers: {
                where: (phone_number, { eq }) => eq(phone_number.isPrimary, true),
                columns: {
                  country_code: true,
                  phone_number: true
                }
              }
            }
          },
          delivery_address: {
            columns: {
              house_number: true,
              address: true,
              city: true
            }
          }
        },
      });

      return tOrder;
    })
    
    return res.status(200).json({success: true, message: "Order fetched successfully", data: fetchedOrder});
  } catch (error: any) {
    return res.status(400).json({success: false, message: "Unable to fetch order", error: error.message ? error.message : error});
  }
}

export {
  createOrder,
  editOrder,
  getAllOrders,
  getOrder
}