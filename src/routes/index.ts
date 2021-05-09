import { Router } from 'express';
import { VerifyUserToken } from '../middlewares/auth';
import { AuthRoutes } from './auth';
import { VerifiRoutes } from './VerifyRoute';

export const Routes = Router()

Routes.use(VerifyUserToken())   //Auth custom middleware

Routes.use('/auth', AuthRoutes)
Routes.use('/verify', VerifiRoutes)