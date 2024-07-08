import express from "express"

const estimateRouter = express.Router();

estimateRouter.route('/createEstimate').post();
estimateRouter.route('/findEstimate').get();
estimateRouter.route('/editEstimate').put();

export default estimateRouter;