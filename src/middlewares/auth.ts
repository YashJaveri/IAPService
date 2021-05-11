import ApiError from "../utils/api-error";
import ErrorProtectedRoute from "../utils/error-protected-route";
import * as admin from "firebase-admin";
import { UserModel } from "../models/user";

export function VerifyUserToken() {
    return ErrorProtectedRoute(async (req: any, res, next) => {
        var token = req.headers['authorization']?.replace('Bearer ', '').trim() //WHY?
        if (token) {                        
            admin.auth().verifyIdToken(token).then((resp) => {
                var uid = resp.uid
                let user = UserModel.findOne({ firebaseId: uid })
                if(!user){
                    let user = {
                        firebaseId: uid,
                        email: resp.email
                    }
                    UserModel.create(user, (err, resp) => {
                        if (err)
                            throw err   //DOUBT
                    })                    
                }
                req.user = UserModel.findOne({ firebaseId: uid })   //Better way?
                next()
            })
            .catch((err) => {
                throw new ApiError('user-not-found', 404, "User not found!")
            })
        } else {
            throw new ApiError('invalid-jwt', 401, "Invalid jwt")
        }
    })
}