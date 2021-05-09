import { Router } from 'express'
import ErrorProtectedRoute from '../utils/error-protected-route'
import { ProfileRoutes } from './profile-routes'

export const AuthRoutes = Router()

AuthRoutes.use('/profile', ProfileRoutes)

AuthRoutes.put('/', ErrorProtectedRoute( async (req, resp) => {

}))

AuthRoutes.post('/', ErrorProtectedRoute( async (req, resp) => {

}))