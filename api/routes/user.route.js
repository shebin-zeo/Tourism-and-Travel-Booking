import express from 'express';
import { test } from '../controllers/user.controller.js'; // Import the test function from the user.controller.js file.

const router = express.Router(); 

router.get('/test', test);
    

export default router;