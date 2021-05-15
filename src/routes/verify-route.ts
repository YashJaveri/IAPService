import { Router } from 'express'
import { VerifyApiKey } from '../middlewares/verify-api-key'
import ApiError from '../utils/api-error'
import ErrorProtectedRoute from '../utils/error-protected-route'
import { ResponseData } from '../utils/response'
import { updateUserStats } from '../utils/user-stats-handeling'
import { verifyIAP } from '../utils/verify-iap'
const iap = require('iap')

export const VerifyRoutes = Router()

VerifyRoutes.use(VerifyApiKey())

VerifyRoutes.post('/', ErrorProtectedRoute(async (req: any, res, next) => {    
    let platform = req.body.platform
    let paymentData = req.body.paymentData

    if(!req.user.disabled)
    {
        updateUserStats(req.user, platform, paymentData.packageName)

        //Error handling left/Make your own library
        await new Promise((resolve, reject) => {
            iap.verifyPayment(platform, paymentData, async (err: Error, response: any) => { 
                if(response){
                    resolve(response)
                    res.send(new ResponseData(response))
                }
                else{
                    reject(new ApiError('verification-failed', err.message, 400))
                }
            })
        })  //Explanation?
    }else{
        throw new ApiError("user-disabled", "Request rejected. Kindly complete your payment to continue using our service!")
    }
}))