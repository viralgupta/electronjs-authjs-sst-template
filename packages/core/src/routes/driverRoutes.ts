import express from "express"


const driverRouter = express.Router()

driverRouter.route('/createDriver').post()
driverRouter.route('/editDriver').put()
driverRouter.route('/getDriver').get()
driverRouter.route('/deleteDriver').delete()
driverRouter.route('/getAllDrivers').get()

export default driverRouter;