import { Router } from 'express';
import { ProfileRoutes } from './profile-routes';
import { UserStatRoutes } from './user-stats';
import { VerifyRoutes } from './verify-route';

export const Routes = Router()

Routes.use('/auth/profile', ProfileRoutes)
Routes.use('/verify', VerifyRoutes)
Routes.use('/user-stat', UserStatRoutes)