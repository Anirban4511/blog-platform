import express from 'express';
import { searchPosts, searchUsers } from '../controllers/searchController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.get('/posts', searchPosts);
router.get('/users', protect, searchUsers);

export default router;
