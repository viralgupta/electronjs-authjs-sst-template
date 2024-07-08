import express from "express"


const miscellaneousRouter = express.Router()

miscellaneousRouter.route('/createPhone').post()
miscellaneousRouter.route('/editPhone').put()

export default miscellaneousRouter;