import ApiError from "../utils/api-error";
import ErrorProtectedRoute from "../utils/error-protected-route";
import * as admin from "firebase-admin";
import { UserModel } from "../models/user";
import { createApiKey } from "../utils/api-key";

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
                        email: resp.email,
                        apiKey: createApiKey().apiKey
                    }
                    UserModel.create(user, (err, resp) => {
                        if (err)
                        {
                            console.log("Error creating: " + err.message)
                            throw new ApiError("failed-creating-object", err.message)
                        }
                        req.user = resp                        
                        next()
                    })                    
                }
                else {                    
                    req.user = user
                    next()
                }
            })
            .catch((err) => {                
                throw new ApiError('user-not-found', "User not found!", 404)
            })
        } else {
            throw new ApiError('invalid-jwt', "Invalid jwt", 401)
        }
    })
}