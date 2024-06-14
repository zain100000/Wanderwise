const express = require("express");
const router = express.Router();
const friendsController = require("../controllers/friends-controller");

router.post("/sendRequest", friendsController.sendFriendRequest);
router.post("/acceptRequest", friendsController.acceptFriendRequest);
router.post("/rejectRequest", friendsController.rejectFriendRequest);
router.post("/removeFriend", friendsController.removeFriend);
router.get("/getFriends", friendsController.getFriends);

module.exports = router;
