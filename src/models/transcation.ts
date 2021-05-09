import { Document, Schema, model, Model } from 'mongoose';

export interface ITransaction extends Document{    
    userId: string,
    price: number,
    currencyCode: string,
    orderId: string
}