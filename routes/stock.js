const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');
const stockController = require('../controller/stock');
// auth.checkAuth, 
//auth.checkAdmin,
router.get('/', stockController.getAllStock);

router.get('/allInvestors' , stockController.AllInvestorDetails);

router.get('/:stockcode', stockController.getAllStockById);

router.post('/',  stockController.addStock);



router.put('/:stockcode',  stockController.checkStock, stockController.updateStock);

router.delete('/:stockcode',stockController.checkStock, stockController.deleteStock);

router.post('/buyStock',stockController.validateBuyingLimit,stockController.addBuyingStock)

router.get('/getInvestorStocks/:investorid',stockController.getBuyingStock)

router.get('/getQuantity/:stockcode',stockController.getStockQuantity)

router.put('/updateBuy/:stockcode',stockController.validateUpdatedQuantity,stockController.addQuantity)

router.put('/sellStock/:stockcode',stockController.validateQuantityForSell,stockController.sellStock)

module.exports = router;
