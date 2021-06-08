import { Router } from 'express'
import { VerifyApiKey } from '../middlewares/verify-api-key'
import ApiError from '../utils/api-error'
import { constants } from '../utils/constants'
import ErrorProtectedRoute from '../utils/error-protected-route'
import { generateBill } from '../utils/generate-bill'
import { ResponseData } from '../utils/response'
import { updateUserStats } from '../utils/user-stats-handeling'
import iap from "../utils/iap"

export const VerifyRoutes = Router()

VerifyRoutes.use(VerifyApiKey())

VerifyRoutes.post('/', ErrorProtectedRoute(async (req: any, res, next) => {    
    let platform = req.body.platform
    let paymentData = req.body.paymentData

    if(!req.user.disabled)
    {   
        let totalReqs = (await generateBill(req.user, new Date().getMonth(), new Date().getFullYear())).totalCount

        if(!req.user.billingEnabled && totalReqs >= constants.FREE_ALLOWANCE)
        {
            throw new ApiError("billing-disabled", "Request rejected. You have exceeded the free limit. Kindly enable the billing option to continue using our service!")
        }
        else{
            updateUserStats(req.user, platform, paymentData.packageName)

            //Error handling left/Use your own library
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
        }
    }else{
        throw new ApiError("user-disabled", "Request rejected. Kindly complete your previous pending payment to continue using our service!")
    }
}))