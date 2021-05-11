import { Router } from 'express'
import { UserModel } from '../models/user'
import ApiError from '../utils/api-error'
import ErrorProtectedRoute from '../utils/error-protected-route'
import { ResponseData } from '../utils/response'

export const ProfileRoutes = Router()

ProfileRoutes.post('/', ErrorProtectedRoute( async (req: any, resp) => {    
    Object.assign(req.user, req.body)
    let updatedUser = await req.users.save()
}))

ProfileRoutes.get('/', ErrorProtectedRoute( async (req: any, resp) => {
    resp.send(new ResponseData(req.user))
}))