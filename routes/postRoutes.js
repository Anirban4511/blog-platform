import express from 'express';
import {
    createPost,
    getPosts,
    getPostById,
    updatePost,
    deletePost,
    likePost,
    unlikePost
} from '../controllers/postController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.post('/', protect, createPost);
router.get('/', getPosts);
router.get('/:id', getPostById);
router.put('/:id', protect, updatePost);
router.delete('/:id', protect, deletePost);
router.put('/:id/like', protect, likePost);
router.put('/:id/unlike', protect, unlikePost);

export default router;
