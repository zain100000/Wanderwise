const express = require("express");
const router = express.Router();
const groupsController = require("../controllers/group-controller");

// Routes
router.post("/create", groupsController.createGroup);
router.put("/update/:id", groupsController.updateGroup);
router.delete("/delete/:id", groupsController.deleteGroup);
router.get("/get/:id", groupsController.getGroupById);
router.get("/all", groupsController.getAllGroups);
router.post("/join/:id", groupsController.joinGroup);
router.post("/leave/:id", groupsController.leaveGroup);

module.exports = router;
