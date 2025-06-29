import express from "express"
import { acceptFriendRequest, cancelFriendRequest, followUser, getAllFriends, getFriendRequests, getMutualFriendRequests, getProfile, getSuggestedPeople, loginUser, logout, registerUser, rejectFriendRequest, searchUsers, sendFriendRequest, unfollowUser, unfriendUser, updateCoverPhoto, updateIntro, updateProfilePhoto } from "../controllers/auth.controller.js";
import { isAuthenticated } from "../middleware/isAuthenticated.js";
import { upload } from "../middleware/multer.js";

const router = express.Router()

router.post('/register',registerUser)
router.post('/login',loginUser)
router.get('/logout', logout)
router.get('/:id/profile', getProfile)
router.put('/update/profile-pic',isAuthenticated,upload.single('file'), updateProfilePhoto)
router.put('/update/cover-pic',isAuthenticated,upload.single('file'), updateCoverPhoto)
router.put("/update-intro", isAuthenticated, updateIntro);
router.put('/follow/:id', isAuthenticated, followUser);
router.put('/unfollow/:id', isAuthenticated, unfollowUser); 
router.put('/request/send/:id', isAuthenticated, sendFriendRequest);
router.put('/request/cancel/:id', isAuthenticated, cancelFriendRequest);
router.put('/request/accept/:id', isAuthenticated, acceptFriendRequest);
router.put('/request/reject/:id', isAuthenticated, rejectFriendRequest);
router.put('/unfriend/:id', isAuthenticated, unfriendUser);
router.get('/requests', isAuthenticated, getFriendRequests);
router.get('/suggestions', isAuthenticated, getSuggestedPeople);
router.get('/requests/mutual', isAuthenticated, getMutualFriendRequests);
router.get('/user/:id/friends', getAllFriends);
router.get("/search", searchUsers);

export default router;