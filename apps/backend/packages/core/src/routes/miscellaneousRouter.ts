import express from "express"


const miscellaneousRouter = express.Router()

miscellaneousRouter.route('/createPhone').post()

export default miscellaneousRouter;