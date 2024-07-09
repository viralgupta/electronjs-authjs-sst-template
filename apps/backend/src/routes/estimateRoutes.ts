import express from "express"
import { createEstimate, findEstimate, editEstimate } from "../controllers/estimateController"

const estimateRouter = express.Router();

estimateRouter.route('/createEstimate').post(createEstimate);
estimateRouter.route('/findEstimate').get(findEstimate);
estimateRouter.route('/editEstimate').put(editEstimate);

export default estimateRouter;