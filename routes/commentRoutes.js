import express from 'express';
import {
    createComment,
    getComments,
    updateComment,
    deleteComment,
    likeComment,
    unlikeComment
} from '../controllers/commentController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.post('/:postId', protect, createComment);
router.get('/:postId', getComments);
router.put('/:id', protect, updateComment);
router.delete('/:id', protect, deleteComment);
router.put('/:id/like', protect, likeComment);
router.put('/:id/unlike', protect, unlikeComment);

export default router;
