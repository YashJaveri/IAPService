import { IUser } from "../models/user";
import { IUserStat, UserStatModel } from "../models/user-stat";
import ApiError from "./api-error";

export async function updateUserStats(user: IUser, platform: string, packageName: string){
    var userStat = await UserStatModel.findOne({ userId: user._id })
    console.log(userStat)

    if(!userStat){
        let userStatObj = {
            userId: user._id,
            requestsStats: [
                {
                    date: Date.now(),
                    requests: [
                        {
                            platform: platform,
                            appId: packageName,
                            countForThisCombo: 1
                        }
                    ]
                }
            ]
        }
        UserStatModel.create(userStatObj, (err, resp) => {
            if(err)
            {
                throw new ApiError("failed-creating-object", err.message)
            }            
        })
    }else{
        let currDate = (new Date(Date.now()).getDate.toString() + + "/" + new Date(Date.now()).getMonth.toString() + "/" + new Date(Date.now()).getFullYear.toString())
        userStat.requestsStats?.forEach((item, index) => {
            let dbDate = (new Date(item.date).getDate.toString() + + "/" + new Date(item.date).getMonth.toString() + "/" + new Date(item.date).getFullYear.toString())            
            if(currDate === dbDate){
                let reqs = item.requests
                //Find by platform + id and update/append
            }
        })
    }
}