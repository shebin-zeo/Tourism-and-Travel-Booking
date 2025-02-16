// In auth.route.js
import express from 'express';
import { signup, signin, google, signOut, adminSignin,guideSignIn } from '../controllers/auth.controller.js';

const router = express.Router();

router.post('/signup', signup);
router.post('/signin', signin);
router.post('/google', google);
router.get('/signout', signOut);

// Add admin signin route:
router.post('/admin/signin', adminSignin);
//Guide Signin route:
router.post('/guide-signin', guideSignIn);


export default router;
