import { Router } from 'express'
import { VerifyUserToken } from '../middlewares/auth'
import { UserStatModel } from '../models/user-stat'
import ApiError from '../utils/api-error'
import ErrorProtectedRoute from '../utils/error-protected-route'
import { filterStatistics, getCompleteUserStats, getCountOfReqPerDay, getCountOfReqPerMonth, getPlatformWiseTotalCount } from '../utils/handle-stat-details'
import { ResponseData } from '../utils/response'

export const UserStatRoutes = Router()

UserStatRoutes.use(VerifyUserToken())   //Auth custom middleware

UserStatRoutes.get('/', ErrorProtectedRoute(async (req: any, resp) => {
    let response: any = {
        all: [],
        google: [],
        apple: [],
        amazon: [],
        packageWise: [],
        monthWise: [],
        dayWise: [],
        amazonCount: 0,
        googleCount: 0,
        appleCount: 0,
    }

    let user = req.user
    let completeUserStatData = await getCompleteUserStats(user, new Date().getMonth(), new Date().getFullYear())
    let userStat = await UserStatModel.findOne({userId:user._id})

    for(let i=0; i<12; i++){
        let monthWiseCount = await getCountOfReqPerMonth(userStat, i, new Date().getFullYear())
        response.monthWise.push(monthWiseCount)
    }

    var dt = new Date();
    let noOfDaysThisMonth = new Date(dt.getFullYear(), dt.getMonth()+1, 0).getDate()

    for(let i=0; i<noOfDaysThisMonth; i++){
        let dayWiseCount = getCountOfReqPerDay(userStat, i+1, dt.getMonth(), dt.getFullYear())
        response.dayWise.push(dayWiseCount)
    }

    response.all = completeUserStatData.statistics
    response.apple = filterStatistics(completeUserStatData, 'apple', "")
    response.google = filterStatistics(completeUserStatData, 'google', "")
    response.amazon = filterStatistics(completeUserStatData, 'amazon', "")

    getPlatformWiseTotalCount(response.apple)
    response.googleCount = getPlatformWiseTotalCount(response.google)
    response.amazonCount = getPlatformWiseTotalCount(response.amazon)
    response.appleCount = getPlatformWiseTotalCount(response.apple)

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