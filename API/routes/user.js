import express from 'express'
import { register,login, profile,verifyOTP } from '../controllers/user.js';
import { Authenticate } from '../middlewares/auth.js';

const router = express.Router();

// user register
router.post("/register", register);

// user login
router.post('/login',login)

// profile

router.get('/user',Authenticate,profile)

//otp verification
router.post("/verifyOTP",verifyOTP);


export default router

