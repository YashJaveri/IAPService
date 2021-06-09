import { Document, Schema, model } from 'mongoose';

export interface IUserStat extends Document {
    userId: string,
    requestsStats: {
        date: number,
        platform: string,
        appId: string,
        countForThisCombo: number
    }[]
}

export const UserStatSchema = new Schema<IUserStat>({
    userId: { type: String, require: [true, "User Id is required"]},
    requestsStats: {
        type: [{
            date: { type: Number, require: [true, "Date is required"]},                            
            platform: { type: String, require: [true, "Platform is required"], enum: ['google', 'apple', 'amazon']},
            appId: { type: String, require: [true, "AppId is required"] },
            countForThisCombo: { type: Number }                
        }]
    }
})

export const UserStatModel = model<IUserStat>('userStatistic', UserStatSchema);