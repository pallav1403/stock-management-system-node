const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');
const investorController = require('../controller/investor');
// auth.checkAuth, 
//auth.checkAdmin,
router.get('/', investorController.getAllInvestor);
router.get('/:user_id', investorController.getAllInvestorById);
router.post('/',  investorController.addInvestor);

router.put('/:user_id',  investorController.checkInvestor, investorController.updateInvestor);

router.delete('/:user_id',investorController.checkInvestor, investorController.deleteInvestor);

module.exports = router;
