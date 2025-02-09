import express from 'express';
import { deleteUser, deleteUserAdmin, getUsersAdmin, test, updateUser, updateUserAdmin } from '../controllers/user.controller.js'; // Import the test function from the user.controller.js file.
import { verifyToken } from '../utils/verifyUser.js';
import { verifyAdmin } from '../utils/verifyAdmin.js';

const router = express.Router(); 

router.get('/test', test);
router.post('/update/:id',verifyToken,updateUser);
router.delete('/delete/:id',verifyToken,deleteUser);
//Adminuser management
router.get('/', verifyToken, verifyAdmin, getUsersAdmin);
router.put('/:id', verifyToken, verifyAdmin, updateUserAdmin);
router.delete('/:id', verifyToken, verifyAdmin, deleteUserAdmin);

    

export default router;