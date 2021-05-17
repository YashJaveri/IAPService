import ApiError from "../utils/api-error";
import ErrorProtectedRoute from "../utils/error-protected-route";
import { UserModel } from "../models/user";

export function VerifyApiKey() {
    return ErrorProtectedRoute(async (req: any, res, next) => {
        let apiKey = req.query.apiKey
        
        if (apiKey) {
            let user = await UserModel.findOne({ apiKey: apiKey })
            console.log("User: " + user)
            if(user){         
                req.user = user
                next()
            }
            else{
                throw new ApiError('invalid-api-key', "User not found. Invalid Api key", 404)
            }        
        } else {
            throw new ApiError('no-api-key-found', "No api key", 401)
        }
    })
}