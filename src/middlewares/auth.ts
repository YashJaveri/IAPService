import ApiError from "../utils/api-error";
import ErrorProtectedRoute from "../utils/error-protected-route";
import * as admin from "firebase-admin";
import { UserModel } from "../models/user";

export function VerifyUserToken() {
    return ErrorProtectedRoute(async (req: any, res, next) => {
        var token = req.headers['authorization']?.replace('Bearer ', '').trim() //WHY?
        if (token) { 
            await admin.auth().verifyIdToken(token).then(async (resp) => {                       
                var uid = resp.uid                
                let user = await UserModel.findOne({ firebaseId: uid })
                
                if(!user){
                    console.log("User not found hence creating")
                    let user = {
                        firebaseId: uid,
                        email: resp.email
                    }
                    UserModel.create(user, (err, resp) => {
                        if (err)
                        {
                            console.log("Error creating: " + err.message)
                            throw err   //DOUBT
                        }
                        req.user = resp                        
                        next()     
                    })
                }
                else {
                    req.user = await UserModel.findOne({ firebaseId: uid })   //Better way?                    
                    next()
                }
            })
            .catch((err) => {                
                throw new ApiError('user-not-found', 404, "User not found!")
            })
        } else {
            throw new ApiError('invalid-jwt', 401, "Invalid jwt")
        }
    })
}