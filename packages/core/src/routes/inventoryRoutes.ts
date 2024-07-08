import express from "express"


const inventoryRouter = express.Router()

inventoryRouter.route('/createItem').post()
inventoryRouter.route('/getAllItems').get()
inventoryRouter.route('/getItem').get()
inventoryRouter.route('/editItem').put()
inventoryRouter.route('/editQuantity').post()
inventoryRouter.route("/deleteItem").delete()

export default inventoryRouter;