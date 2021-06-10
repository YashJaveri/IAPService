import { UserStatModel } from "../models/user-stat";
import { IUser } from "../models/user"
import { constants } from "./constants";

export async function getCompleteUserStats(user: IUser, month: number, year:number){
    
    var userStat = await UserStatModel.findOne({userId:user._id})
    
    if(!userStat){
        return {
            rate: constants.RATE_PER_REQUEST,
            freeAllowance: constants.FREE_ALLOWANCE,
            totalCount: 0,
            statistics: []
        }
        //throw new ApiError('user-not-found', 'User not found while fetching user stat', 404)
    }else{
        let givenMonthData = userStat?.requestsStats.filter(item => {
            return month===new Date(item.date).getMonth() 
            && year===new Date(item.date).getFullYear()})

        
        let totalCountOfRequests = 0
        let platformAppMapper = new Map()

        for (let i=0; i<givenMonthData.length;i++){
            let count = givenMonthData[i].countForThisCombo
            totalCountOfRequests += count

            let platform: string = givenMonthData[i].platform
            let appId: string = givenMonthData[i].appId

            let key = platform+" "+appId

            if(platformAppMapper.get(key) === undefined){
                platformAppMapper.set(key, count)
            }else{
                let countTillNow = platformAppMapper.get(key)
                platformAppMapper.set(key, countTillNow + count)
            }
        }

        var stats = []
        for (let [key,value] of platformAppMapper.entries()) {
            let obj = {
                platform: key.split(' ')[0],
                appId: key.split(' ')[1],
                count: value,
                totalPrice: value*constants.RATE_PER_REQUEST
            }
            stats.push(obj)
        }        
        var billDetails = { //All details, currently
            rate: constants.RATE_PER_REQUEST,
            freeAllowance: constants.FREE_ALLOWANCE,
            totalCount: totalCountOfRequests,
            statistics: stats
        }

        return billDetails
    }
}

export function filterStatistics(billDetails: any, platf:string = "", packageName:string = ""){
        
        if(packageName !== "" && platf === ""){
            let x = billDetails.statistics.filter((item: any) => item.appId === packageName)
            return x
        }else if(platf !== "" && packageName === ""){
            let x = billDetails.statistics.filter((item: any) => item.platform === platf)
            return x
        }else if(platf !== "" && packageName !== ""){
            let x = billDetails.statistics.filter((item: any) => (item.platform === platf && item.appId === packageName))
            return x
        }

        return billDetails.statistics
}