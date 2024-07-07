import express from "express"


const architectRouter = express.Router()

architectRouter.route('/createArchitect').post()
architectRouter.route('/editArchitect').put()
architectRouter.route('/getArchitect').get()
architectRouter.route('/deleteArchitect').delete()
architectRouter.route('/getAllArchitects').get()

export default architectRouter;