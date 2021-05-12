import ApiError from "../utils/api-error";
import ErrorProtectedRoute from "../utils/error-protected-route";
import { UserModel } from "../models/user";

export function VerifyApiKey() {
    return ErrorProtectedRoute(async (req: any, res, next) => {
        let apiKey = req.query.apiKey
        if (apiKey) {
            try{
                let user = await UserModel.findOne({apiKey: apiKey})
                req.user = user
            }
            catch(err){
                console.log(err)
                throw new ApiError('invalid-api-key', 404, "User not found. Invalid Api key")
            }            
        } else {
            throw new ApiError('no-api-key-found', 401, "No api key")
        }
    })
}