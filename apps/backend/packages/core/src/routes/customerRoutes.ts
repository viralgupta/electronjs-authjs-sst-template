import express from "express"


const customerRouter = express.Router()

customerRouter.route('/createCustomer').post()
customerRouter.route('/addAddress').post()
customerRouter.route('/editCustomer').put()
customerRouter.route('/settleBalance').put()
customerRouter.route('/getCustomer').get()
customerRouter.route('/deleteCustomer').delete()
customerRouter.route('/getAllCustomers').get()

export default customerRouter;