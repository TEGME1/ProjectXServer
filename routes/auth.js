import express from 'express'
import db from '../config.js';
import authController from '../controllers/auth.js'

const router = express.Router()

router.post('/login', authController.postLogin);
router.post('/signup',authController.postSignUp)

export default router

