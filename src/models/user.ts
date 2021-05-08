import { Document, Schema, model, Model } from 'mongoose';

export interface IUser extends Document{    
    name: string,
    email: string,
    phoneNumber?: string,
    passwordHash: string,
    passwordSalt: string,
    numberOfRequests: number,    
    previousPaidDate: string,  
    disabled: boolean
}

