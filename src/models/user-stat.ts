import { Document, Schema, model, Model } from 'mongoose';

export interface IUserStat extends Document {
    userId: string,
    requestsStats: {
        date: string,
        resquests: {
            platform: string,
            appId: string,
            count: number
        }[]
    }[]
}