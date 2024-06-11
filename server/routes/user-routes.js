const express = require('express');
const router = express.Router();
const userController = require('../controllers/user-controller');
const authenticateToken = require('../middleware/auth');
const upload = require('../middleware/upload');

// Routes
router.post('/signup', upload.single('profilePicture'), userController.signup);
router.post('/login', userController.login);
router.get('/getUsers', authenticateToken, userController.getUsers);
router.get('/getUserById/:id', authenticateToken, userController.getUserById);
router.put('/updateUser/:id', authenticateToken, upload.single('profilePicture'), userController.updateUser);
router.delete('/deleteUser/:id', authenticateToken, userController.deleteUser);

module.exports = router;
