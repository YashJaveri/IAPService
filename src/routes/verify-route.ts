import { Router } from 'express'
import { VerifyApiKey } from '../middlewares/verify-api-key'
import ApiError from '../utils/api-error'
import ErrorProtectedRoute from '../utils/error-protected-route'
import { ResponseData } from '../utils/response'
import { verifyIAP } from '../utils/verify-iap'
const iap = require('iap')

export const VerifyRoutes = Router()

VerifyRoutes.use(VerifyApiKey())

VerifyRoutes.post('/', ErrorProtectedRoute(async (req: any, res, next) => {
    let platform = req.body.platform
    let paymentData = req.body.paymentData
    //let receipt = verifyIAP(platform, receiptData
    await iap.verifyPayment(platform, paymentData, async (error: String, response: any)=>{
        if(error){
            throw new ApiError('verification-failed', 'Verification failed', 400)
        }else{
            res.send(new ResponseData(response))
        }
    })
}))