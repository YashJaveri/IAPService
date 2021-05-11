import { Router } from 'express';
import { VerifyUserToken } from '../middlewares/auth';
import { ProfileRoutes } from './profile-routes';
import { VerifyRoutes } from './verify-route';

export const Routes = Router()

Routes.use(VerifyUserToken())   //Auth custom middleware

Routes.use('/auth/profile', ProfileRoutes)
Routes.use('/verify', VerifyRoutes)