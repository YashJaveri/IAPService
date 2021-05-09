import { Document, Schema, model } from 'mongoose';

export interface IUser extends Document{
    firebaseId: string,
    name?: string,
    email: string,
    phoneNumber?: string,    
    apikey?: string,    
    billingEnabled?: boolean,
    disabled?: boolean,
    googleConfig?: {},
    appleConfig?: {
        secret: string
    },
    amazonConfig?: {
        userId: string,
        secret: string
    }
}

export const UserSchema = new Schema<IUser>({
    firebaseId: { type: String, require: [true, "Firebase id is required"]},
    name: { type: String },
    email: { type: String, require: [true, "Email is required"] },
    phoneNumber: { type: String, unique: true },
    apikey: { type: String },
    billingEnabled: { type: Boolean },
    disabled: { type: Boolean },
    googleConfig: { type: {} },
    appleConfig: { 
        type: {
            secret: { type: String }
        }
    },
    amazonConfig: { 
        type: {
            userId: { type: String },
            secret: { type: String }
        }
    }
})

export const UserModel = model<IUser>('user', UserSchema);