import { Router } from 'express'
import { VerifyUserToken } from '../middlewares/auth'
import ApiError from '../utils/api-error'
import ErrorProtectedRoute from '../utils/error-protected-route'
import { filterStatistics, getCompleteUserStats } from '../utils/handle-stat-details'
import { ResponseData } from '../utils/response'

export const UserStatRoutes = Router()

UserStatRoutes.use(VerifyUserToken())   //Auth custom middleware

UserStatRoutes.get('/', ErrorProtectedRoute(async (req: any, resp) => {
    let response: any = {
        all: [],
        google: [],
        apple: [],
        amazon: [],
        packageWise: []
    }

    let user = req.user
    let completeUserStatData = await getCompleteUserStats(user, new Date().getMonth(), new Date().getFullYear())

    response.all = completeUserStatData.statistics
    response.apple = filterStatistics(completeUserStatData, 'apple', "")
    response.google = filterStatistics(completeUserStatData, 'google', "")
    
    response.amazon = filterStatistics(completeUserStatData, 'amazon', "")

    let packageMap = new Map()

    for(let item of completeUserStatData.statistics){        
        if(packageMap.get(item.appId) === undefined){
            packageMap.set(item.appId, 1)
        }
    }

    for(let packageName of packageMap.keys()){
        response.packageWise.push(filterStatistics(completeUserStatData, 'google', packageName)[0])
        response.packageWise.push(filterStatistics(completeUserStatData, 'apple', packageName)[0])
        response.packageWise.push(filterStatistics(completeUserStatData, 'amazon', packageName)[0])
    }

    resp.send(new ResponseData(response))
}))