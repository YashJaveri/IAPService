import { Document, Schema, model } from 'mongoose';

export interface IUserStat extends Document {
    userId: string,
    requestsStats?: {
        date: string,
        requests: {
            platform: string,
            appId: string,
            countForThisCombo: number
        }[],
    }[]
}

export const UserStatSchema = new Schema<IUserStat>({
    userId: { type: String, require: [true, "User Id is required"]},
    requestsStats: {
        type: [{
            date: { type: String, require: [true, "Date is required"]},
            resquests: {
                type: [{
                    platform: { type: String, require: [true, "Platform is required"] },
                    appId: { type: String, require: [true, "AppId is required"] },
                    countForThatDay: { type: Number }
                }]
            }
        }]
    }
})

export const UserStatModel = model<IUserStat>('user', UserStatSchema);