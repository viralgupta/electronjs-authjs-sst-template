import express from "express"
import { createArchitect, editArchitect, settleBalance, getArchitect, deleteArchitect, getAllArchitects } from "../controllers/architectController"

const architectRouter = express.Router()

architectRouter.route('/createArchitect').post(createArchitect)
architectRouter.route('/editArchitect').put(editArchitect)
architectRouter.route('/settleBalance').put(settleBalance)
architectRouter.route('/getArchitect').get(getArchitect)
architectRouter.route('/deleteArchitect').delete(deleteArchitect)
architectRouter.route('/getAllArchitects').get(getAllArchitects)

export default architectRouter;