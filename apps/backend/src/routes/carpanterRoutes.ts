import express from "express"
import {createCarpanter, editCarpanter, settleCarpanterBalance, getCarpanter, deleteCarpanter, getAllCarpanters} from "../controllers/carpanterController"

const carpanterRouter = express.Router()

carpanterRouter.route('/createCarpanter').post(createCarpanter)
carpanterRouter.route('/editCarpanter').put(editCarpanter)
carpanterRouter.route('/settleCarpanterBalance').put(settleCarpanterBalance)
carpanterRouter.route('/getCarpanter').get(getCarpanter)
carpanterRouter.route('/deleteCarpanter').delete(deleteCarpanter)
carpanterRouter.route('/getAllCarpanters').get(getAllCarpanters)

export default carpanterRouter;