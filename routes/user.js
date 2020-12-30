const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');
const userController = require('../controller/user');
// auth.checkAuth, 
//auth.checkAdmin,
router.get('/', userController.getAllUser);
router.get('/:user_id', userController.getAllUserById);
router.post('/',  userController.addUser);

router.put('/:user_id',  userController.checkUser, userController.updateUser);

router.delete('/:user_id',userController.checkUser, userController.deleteUser);

module.exports = router;
