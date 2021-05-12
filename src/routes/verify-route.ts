import { Router } from 'express'
import { VerifyApiKey } from '../middlewares/verify-api-key'
import ErrorProtectedRoute from '../utils/error-protected-route'
import { verifyIAP } from '../utils/verify-iap'

export const VerifyRoutes = Router()

VerifyRoutes.use(VerifyApiKey())

VerifyRoutes.post('/', ErrorProtectedRoute(async (req: any, res, next) => {
    let platform = req.body.platform
    let receiptData = req.body.receiptData
    let receipt = verifyIAP(platform, receiptData)
}))