import express from 'express';
import { 
    getProfile, 
    updateProfile, 
    deleteProfile,
    getAllUsers,
    getUserById,
    updateUserAdminStatus
} from '../controllers/userController.js';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

router.get('/', protect, admin, getAllUsers);
router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);
router.delete('/profile', protect, deleteProfile);
router.get('/:id', protect, getUserById);
router.put('/:id/admin', protect, admin, updateUserAdminStatus);

export default router;
