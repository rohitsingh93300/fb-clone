import express from 'express';
import { isAuthenticated } from '../middleware/isAuthenticated.js';
import { createStory, deleteStory, getAllStories, getUserStories } from '../controllers/story.controller.js';
import { upload } from '../middleware/multer.js';


const router = express.Router();

router.post('/create', isAuthenticated, upload.single('file'), createStory);
router.get('/me', isAuthenticated, getUserStories);
router.get('/all', isAuthenticated, getAllStories);
router.delete('/:id', isAuthenticated, deleteStory); 

export default router;