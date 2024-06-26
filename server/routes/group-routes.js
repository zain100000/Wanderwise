const express = require("express");
const router = express.Router();
const groupsController = require("../controllers/group-controller");
const authMiddleware = require("../middleware/auth/auth-middleware");

// Routes
router.post("/create", authMiddleware, groupsController.createGroup);
router.put("/update/:id", authMiddleware, groupsController.updateGroup);
router.delete("/delete/:id", authMiddleware, groupsController.deleteGroup);
router.get("/get/:id", groupsController.getGroupById);
router.get("/all", groupsController.getAllGroups);
router.post("/join/:id", authMiddleware, groupsController.joinGroup);
router.post("/leave/:id", authMiddleware, groupsController.leaveGroup);

module.exports = router;
