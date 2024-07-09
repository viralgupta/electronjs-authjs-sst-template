import express from "express"
import { createPhone, editPhone, deletePhone, createSignedURL } from "../controllers/miscellaneousController"

const miscellaneousRouter = express.Router()

miscellaneousRouter.route('/createPhone').post(createPhone)
miscellaneousRouter.route('/editPhone').put(editPhone)
miscellaneousRouter.route('/deletePhone').delete(deletePhone)
miscellaneousRouter.route('/createSignedURL').get(createSignedURL)

export default miscellaneousRouter;