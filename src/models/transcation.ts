import { Document, Schema, model, Model } from 'mongoose';

export interface ITransaction extends Document{    
    userId: string,
    price: number,
    currencyCode: string,
    orderId: string,
    forBillDate: number
}

export const TransactionSchema = new Schema<ITransaction>({
    userId: { type: String, require: [true]},
    price: { type: Number, require: [true]},
    currencyCode: { type: String, require: [true]},
    orderId: { type: String, require: [true]},
    forBillDate: { type: Number, require: [true]},  
})

export const TransactionModel = model<ITransaction>('transaction', TransactionSchema);