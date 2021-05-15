import { UserStatModel } from "../models/user-stat";
import ApiError from "./api-error";

export async function getBillDetail(uid: string, month: number, year:number, platf:string = "", packageName:string = ""){
    var userStat = await UserStatModel.findOne({userId:uid})

    if(!userStat){
        throw new ApiError('user-not-found', 'User not found while fetching user stat', 404)
    }else{
        let givenMonthData = userStat?.requestsStats.filter(item => (month===new Date(item.date).getMonth() 
            && year===new Date(item.date).getFullYear()))

        let totalCountOfRequests = 0
        let platformAppMapper = new Map()

        for (let i=0; i<givenMonthData.length;i++){
            let count = givenMonthData[i].countForThisCombo
            totalCountOfRequests += count

            let platform: string = givenMonthData[i].platform
            let appId: string = givenMonthData[i].appId

            if ((!packageName && !platf) || ((packageName || platf) && ((packageName===undefined && platf===platform) 
            || (platf===undefined && packageName===appId) 
            || (platf===platform && packageName===appId)))){

                let key = platform+" "+appId

                if(platformAppMapper.get(key) === undefined){
                    platformAppMapper.set(key, count)
                }else{
                    let countTillNow = platformAppMapper.get(key)
                    platformAppMapper.set(key, countTillNow + count)
                }
            } 
        }

        var stats = []
        for (let [key,value] of platformAppMapper.entries()) {
            let obj = {
                platform: key.split(' ')[0],
                appId: key.split(' ')[1],
                count: value
            }
            stats.push(obj)
        }        
        var billDetails = { //All details, currently
            totalCountOfRequests: totalCountOfRequests,
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