const router = require ('express').Router();
const userController = require('../controllers/User.controller');

router.get('/api/users',userController.getAllUsers);
router.post('/api/users',userController.createUser);
router.get('/api/users/:id',userController.getUserById);
router.put('/api/users/:id',userController.updateUserById);
router.delete('/api/users/:id',userController.deleteUserById);

module.exports = router;