import { Router } from 'express'
import { VerifyUserToken } from '../middlewares/auth'
import ApiError from '../utils/api-error'
import ErrorProtectedRoute from '../utils/error-protected-route'
import { ResponseData } from '../utils/response'

export const ProfileRoutes = Router()

ProfileRoutes.use(VerifyUserToken())   //Auth custom middleware

ProfileRoutes.post('/', ErrorProtectedRoute( async (req: any, resp) => {    
    Object.assign(req.user, req.body)    
    try{
        let updatedUser = await req.user.save()        
        if(updatedUser !== undefined)
        {  
            resp.send(new ResponseData(updatedUser).toJSON())
        }
    }
    catch(err){
        console.log(err)
        throw new ApiError("unknown-error", err.message, 400)   //check all possible error types and change the result code accordingly/do this on client side
    }
}))

ProfileRoutes.get('/', ErrorProtectedRoute( async (req: any, resp) => {    
    resp.send(new ResponseData(req.user).toJSON())
}))