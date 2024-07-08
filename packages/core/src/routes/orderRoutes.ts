import express from "express"


const orderRouter = express.Router()

orderRouter.route('/createOrder').post()
orderRouter.route('/editOrder').put()
orderRouter.route('/getAllOrders').get()
orderRouter.route('/getOrder').get()

export default orderRouter;