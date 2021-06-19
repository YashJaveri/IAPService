import { IUserStat, UserStatModel } from "../models/user-stat";
import { IUser } from "../models/user"
import { constants } from "./constants";
import { InvoiceModel } from "../models/invoice";

export async function getCountOfReqPerMonth(userStat: any, month: number, year:number) {
    if(!userStat){
        return {
            rate: constants.RATE_PER_REQUEST,
            freeAllowance: constants.FREE_ALLOWANCE,
            totalCount: 0,
            statistics: []
        }
    }else{
        let givenMonthData = userStat?.requestsStats.filter((item:any) => {
            return month===new Date(item.date).getMonth() 
            && year===new Date(item.date).getFullYear()
        })

        let totalCountOfRequests = 0

        for(let i=0; i<givenMonthData.length;i++) {
            totalCountOfRequests +=  givenMonthData[i].countForThisCombo
        }

        return totalCountOfRequests
    }
}

export function getCountOfReqPerDay(userStat: any, day: number, month: number, year: number, platform: string) {
    
    if(!userStat){
        return {
            rate: constants.RATE_PER_REQUEST,
            freeAllowance: constants.FREE_ALLOWANCE,
            totalCount: 0,
            statistics: []
        }
    }else{
        let givenDayData = userStat?.requestsStats.filter((item:any) => {
            return month===new Date(item.date).getMonth() 
            && year===new Date(item.date).getFullYear()
            && day===new Date(item.date).getDate()
        })
        
        let totalCountOfRequests = 0

        for(let i=0; i<givenDayData.length; i++) {
        
            if(platform==='total' || givenDayData[i].platform === platform){
                totalCountOfRequests +=  givenDayData[i].countForThisCombo
            }
        }
        
        return totalCountOfRequests
    }
}

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

        for (let i=0; i<givenMonthData.length; i++){
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

export function getPlatformWiseTotalCount(platformDetails: any) {
    let totalCount = 0

    for(let i=0; i<platformDetails.length; i++){
        totalCount += platformDetails[i].count
    }

    return totalCount
}

export async function getLatestInvoiceDetails(user: IUser, month: number, year: number) {
    var invoice = await InvoiceModel.findOne({userId: user._id, createdAt: {
        // TODO: add 1 in place of 15 and 2 in place of 16
        $gte: new Date(year, month, 15), 
        $lte: new Date(year, month, 16)
    } })
    
    return invoice
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