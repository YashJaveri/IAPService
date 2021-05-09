import { Document, Schema, model, Model } from 'mongoose';

export interface IUser extends Document{
    name: string,
    email: string,
    phoneNumber?: string,
    passwordHash: string,
    passwordSalt: string,
    apikey: string,    
    billingEnabled: boolean,
    disabled: boolean,
    googleConfig: {},
    appleConfig: {
        secret: string
    },
    amazonConfig: {
        userId: string,
        secret: string
    }
}