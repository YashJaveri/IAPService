import { Document, Schema, model, Model } from 'mongoose';

export interface IInvoice extends Document {
    userId: string,
    billDetails: {
        rate: number,
        freeAllowance: number,
        totalCount: number,
        statistics: {
            platform: string,
            appId: string,
            count: number,
            totalPrice: number
        }[]
    },
    amount: number,
    currencyCode?: string,
    transactionId?: string,
    paid: boolean,
}

export const InvoiceSchema = new Schema<IInvoice>({
    userId: { type: String, require: [true] },
    billDetails: {
        type: {
            rate: { type: Number, require: [true] },
            freeAllowance: { type: Number, require: [true] },
            totalCount: { type: Number, require: [true] },
            statistics: {
                type: [{
                    platform: { type: String, require: [true] },
                    appId: { type: String, require: [true] },
                    count: { type: Number, require: [true] },
                    totalPrice: { type: Number, require: [true] }
                }]
            }
        }, require: [true]
    },
    amount: { type: Number, require: [true] },
    currencyCode: { type: String },
    transactionId: { type: String },
    paid: { type: Boolean, default: false },
}, { timestamps: true })

export const InvoiceModel = model<IInvoice>('invoice', InvoiceSchema);