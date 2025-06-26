const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profileController');
const upload = require('../config/multerConfig');
const { isAuthenticated } = require('../middleware/auth'); 

router.post('/update-profile', isAuthenticated, upload.single('profilePhoto'), profileController.updateProfilePhoto);
router.post('/update-username', isAuthenticated, profileController.updateUsername);
router.post('/update-phone', isAuthenticated, profileController.updatePhoneNumber);
router.post('/change-password', isAuthenticated, profileController.changePassword);
router.post('/delete-account', isAuthenticated, profileController.deleteAccount);

module.exports = router;