import express from "express"
import { createPhone, editPhone, deletePhone, createPutSignedURL, createGetSignedURL } from "../controllers/miscellaneousController"

const miscellaneousRouter = express.Router()

miscellaneousRouter.route('/createPhone').post(createPhone)
miscellaneousRouter.route('/editPhone').put(editPhone)
miscellaneousRouter.route('/deletePhone').delete(deletePhone)
miscellaneousRouter.route('/createPutSignedURL').get(createPutSignedURL)
miscellaneousRouter.route('/createGetSignedURL').get(createGetSignedURL)

export default miscellaneousRouter;