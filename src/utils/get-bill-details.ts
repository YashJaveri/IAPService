import { UserStatModel } from "../models/user-stat";
import ApiError from "./api-error";
import { IUser } from "../models/user"
import { constants } from "./constants";

export async function getBillDetail(user: IUser, month: number, year:number, platf:string = "", packageName:string = ""){
    
    var userStat = await UserStatModel.findOne({userId:user._id})
    

    if(!userStat){
       
        return {
            billedRequests: 0,
            amountPayable: 0, 
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
                total: value*constants.RATE_PER_REQUEST
            }
            stats.push(obj)
        }        
        var billDetails = { //All details, currently
            billedRequests: Math.max(0, totalCountOfRequests - constants.FREE_ALLOWANCE),
            amountPayable: Math.max(0, totalCountOfRequests - constants.FREE_ALLOWANCE)*constants.RATE_PER_REQUEST,
            totalCount: totalCountOfRequests,
            statistics: stats
        }
        
        //Filteration
        if(packageName !== "" && platf === "")
        {
            let x = billDetails.statistics.filter(item => item.appId === packageName)
            billDetails.statistics = x            
        }else if(platf !== "" && packageName === ""){
            let x = billDetails.statistics.filter(item => item.platform === platf)
            billDetails.statistics = x      
        }else if(platf !== "" && packageName !== ""){
            let x = billDetails.statistics.filter(item => (item.platform === platf && item.appId === packageName))
            billDetails.statistics = x 
        }

        return billDetails
    }
}