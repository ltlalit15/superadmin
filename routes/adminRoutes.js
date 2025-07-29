const express = require('express');
const router = express.Router();
const { createAdmin,
    getAllAdmins,
    deleteAdmin,
    updateAdmin,
    resetPassword,
    toggleAdminStatus,
    changePassword,
    getAdminById,
    profileEdit

} = require('../controller/adminController');

// You should apply auth middleware for superadmin here
router.post('/create-admin', createAdmin);
router.get('/getAll-admin', getAllAdmins);
router.delete('/delete/:id', deleteAdmin);
router.put('/update/:id', updateAdmin);
router.put('/reset-password/:id', resetPassword);
router.put("/toggle-status/:id", toggleAdminStatus);
router.put('/change-password/:id', changePassword);
router.get('/getById/:id', getAdminById);
router.put('/profile-edit/:id', profileEdit);

module.exports = router;
