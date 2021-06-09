import { Document, Schema, model } from 'mongoose';

export interface IUser extends Document{
    firebaseId: string,
    name?: string, //we should make this compulsory?
    email: string,
    phoneNumber?: string,    
    apiKey?: string,    
    billingEnabled?: boolean,    
    disabled?: boolean,    
    googleConfig?: {},  //To Do
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
    name: { type: String, default: "" },
    email: { type: String, require: [true, "Email is required"] },
    phoneNumber: { type: String }, //TODO
    apiKey: { type: String, default: "" },
    billingEnabled: { type: Boolean, default: false },
    disabled: { type: Boolean, default: false },
    googleConfig: { type: {}, default: null },
    appleConfig: { 
        type: {
            secret: { type: String, default: "" }
        },
        default: {            
            secret: ""
        } 
    },
    amazonConfig: { 
        type: {
            userId: { type: String, default: "" },
            secret: { type: String, default: ""}
        },
        default: {
            userId: "",
            secret: ""
        }
    }
})

export const UserModel = model<IUser>('user', UserSchema);