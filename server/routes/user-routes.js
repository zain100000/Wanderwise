const express = require("express");
const router = express.Router();
const userController = require("../controllers/user-controller");
const authMiddleware = require("../middleware/auth/auth-middleware");
const profileImageUpload = require("../middleware/file-upload");
const friendsController = require('../controllers/friends-controller');

// Routes
router.post("/signup", profileImageUpload.upload, userController.signup);
router.post("/login", userController.login);
router.get("/getUsers", authMiddleware, userController.getUsers);
router.get("/getUserById/:id", authMiddleware, userController.getUserById);
router.put(
  "/updateUser/:id",
  authMiddleware,
  profileImageUpload.upload,
  userController.updateUser
);

router.post("/reset-password", userController.resetPassword);

router.delete("/removeUser/:id", authMiddleware, userController.deleteUser);

// Friend routes
router.post('/friend-request', friendsController.sendFriendRequest);
router.post('/accept-friend-request', friendsController.acceptFriendRequest);
router.post('/reject-friend-request', friendsController.rejectFriendRequest);
router.post('/remove-friend', friendsController.removeFriend);
router.get('/friends', friendsController.getFriends);

module.exports = router;
