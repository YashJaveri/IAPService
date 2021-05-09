import { Router } from 'express'
import ErrorProtectedRoute from '../utils/error-protected-route'

export const ProfileRoutes = Router()

ProfileRoutes.post('/', ErrorProtectedRoute( async (req, resp) => {

}))

ProfileRoutes.get('/', ErrorProtectedRoute( async (req, resp) => {

}))