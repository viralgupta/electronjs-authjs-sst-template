import express from "express"
import { createCustomer, addAddress, editCustomer, settleBalance, getCustomer, deleteCustomer, getAllCustomers } from "../controllers/customerController"

const customerRouter = express.Router()

customerRouter.route('/createCustomer').post(createCustomer)
customerRouter.route('/addAddress').post(addAddress)
customerRouter.route('/editCustomer').put(editCustomer)
customerRouter.route('/settleBalance').put(settleBalance)
customerRouter.route('/getCustomer').get(getCustomer)
customerRouter.route('/deleteCustomer').delete(deleteCustomer)
customerRouter.route('/getAllCustomers').get(getAllCustomers)

export default customerRouter;