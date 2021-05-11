import { Router } from 'express'
import { UserModel } from '../models/user'
import ApiError from '../utils/api-error'
import ErrorProtectedRoute from '../utils/error-protected-route'
import { ResponseData } from '../utils/response'

export const ProfileRoutes = Router()

ProfileRoutes.post('/', ErrorProtectedRoute( async (req: any, resp) => {    
    Object.assign(req.user, req.body)
    try{
        let updatedUser = await req.users.save()
        if(updatedUser !== undefined)
        {  
            resp.send(new ResponseData(updatedUser).toJSON())
        }
    }
    catch(err){
        console.log(err)
        throw new ApiError("unknown-error", 400, err.message)   //check all possible error types and change the result code accordingly/do this on client side
    }
}))

ProfileRoutes.get('/', ErrorProtectedRoute( async (req: any, resp) => {
    resp.send(new ResponseData(req.user).toJSON())
}))