import { Router } from 'express';
import { ProfileRoutes } from './profile-routes';
import { VerifyRoutes } from './verify-route';

export const Routes = Router()

Routes.use('/auth/profile', ProfileRoutes)
Routes.use('/verify', VerifyRoutes)