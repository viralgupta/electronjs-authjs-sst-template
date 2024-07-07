import express from "express"


const inventoryRouter = express.Router()

inventoryRouter.route('/createItem').post()
inventoryRouter.route('/getAllItems').get()
inventoryRouter.route('/getItem').get()
inventoryRouter.route('/editItem').put()

export default inventoryRouter;