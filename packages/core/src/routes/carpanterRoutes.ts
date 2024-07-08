import express from "express"


const carpanterRouter = express.Router()

carpanterRouter.route('/createCarpanter').post()
carpanterRouter.route('/editCarpanter').put()
carpanterRouter.route('/getCarpanter').get()
carpanterRouter.route('/deleteCarpanter').delete()
carpanterRouter.route('/getAllCarpanters').get()

export default carpanterRouter;