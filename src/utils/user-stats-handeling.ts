import { IUser } from "../models/user";
import { UserStatModel } from "../models/user-stat";
import ApiError from "./api-error";

function getUserStatJsObj(id: string, platform: string, packageName: string, date: number, count: number){
    let userStatObj = {
        userId: id,
        requestsStats: [
            {
                date: date,
                platform: platform,
                appId: packageName,
                countForThisCombo: count
            }
        ]
    }
    return userStatObj
}

export async function updateUserStats(user: IUser, platform: string, packageName: string){
    var userStat = await UserStatModel.findOne({ userId: user._id })    

    if(!userStat){
        let userStatObj = getUserStatJsObj(user._id, platform, packageName, Date.now(), 1)
        UserStatModel.create(userStatObj, (err, resp) => {
            if (err) {
                throw new ApiError("failed-creating-object", err.message);
            }
        })
    }else{                
        let requestStatObjInd = userStat.requestsStats.findIndex(item => (new Date(item.date).toDateString() == new Date().toDateString() 
            && item.platform === platform
            && item.appId === packageName
        ))
        
        if(requestStatObjInd == -1){
            userStat.requestsStats?.push({                
                date: Date.now(),
                platform: platform,
                appId: packageName,
                countForThisCombo: 1              
            })            
        }else{
            userStat.requestsStats[requestStatObjInd].countForThisCombo = userStat.requestsStats[requestStatObjInd].countForThisCombo + 1            
        }
        await userStat.save()
    }
}