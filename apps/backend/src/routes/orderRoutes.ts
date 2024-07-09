import express from "express"
import { createOrder, editOrder, getAllOrders, getOrder } from "../controllers/orderController"

const orderRouter = express.Router()

orderRouter.route('/createOrder').post(createOrder)
orderRouter.route('/editOrder').put(editOrder)
orderRouter.route('/getAllOrders').get(getAllOrders)
orderRouter.route('/getOrder').get(getOrder)

export default orderRouter;