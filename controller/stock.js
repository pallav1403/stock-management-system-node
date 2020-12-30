const db = require('../util/database');
const { v4: uuidv4 } = require('uuid');

const checkStock = (req, res, next) => {
    console.log(req.params.stockcode)
    const checkAvailability = `
        SELECT * FROM stock
        WHERE stockcode ='${req.params.stockcode}'
    `;
    db.query(checkAvailability).then(dbRes => {
        console.log(dbRes.rows)
        if (dbRes.rows.length > 0) {
            next();
        } else {
            res.json({
                error: true,
                message: 'No user found with the ID'
            });
        }
    });
}

const getAllStock = (req, res, next) => {
    const query = 'SELECT * FROM stock';
    db.query(query).then(dbRes => {
        res.json({
            error: false,
        stocks: dbRes.rows
        });
    }).catch(dbErr => {
        next(dbErr);
    });
}

const getAllStockById = (req, res, next) => {
    
    const query = `SELECT * FROM stock where stockcode='${req.params.stockcode}'`;
    db.query(query).then(dbRes => {
        res.json({
            error: false,
            stocks: dbRes.rows,
            message:"success"
        });
    }).catch(dbErr => {
        console.log("next error")
        next(dbErr);
    });
}
const addStock = (req, res, next) => {
    const query = `
        INSERT INTO stock
        VALUES (
            '${req.body.stockcode}', 
            '${req.body.name}',
            ${req.body.price},
            ${req.body.stocklimit}
            
            )`;
    db.query(query).then(dbRes => {
        res.json({
            error: false,
            data: dbRes.rows
        });
    }).catch(dbRes => {
        next(dbErr);
    });
}

const updateStock = (req, res, next) => {
    console.log(req.params.stockcode,req.body)
    const updateQuery = `
        UPDATE stock
        SET 
            price=${req.body.price}, 
            name='${req.body.name}',
            stocklimit=${req.body.stocklimit}
           
        WHERE stockcode='${req.params.stockcode}'
    `;
    db.query(updateQuery).then(dbRes => {
        console.log(dbRes.rows)
        res.json({
            error: false,
            message: 'Stock details updated successfully'
        });
    }).catch(dbErr => {
        console.log("here")
        next(dbErr);
    });
}

const deleteStock = (req, res, next) => {
    const query = `
        DELETE FROM stock
        WHERE stockcode='${req.params.stockcode}'
    `;
    db.query(query).then(dbRes => {
        res.json({
            error: false,
            message: 'Stock Deleted Successfully'
        });
    }).catch(dbErr => {
        next(dbErr);
    });
}



const validateBuyingLimit=(req,res,next)=>{
    const query=`select stocklimit from stock`;
    // console.log("gdbqhdgv",req.body.quantity)
    db.query(query).then(dbRes => {
        if(dbRes.rows[0].stocklimit>=req.body.quantity){
        next()
        }
        else{
            res.json({
                error:true,
                stocklimit:dbRes.rows[0].stocklimit
            })
        }
    }).catch(dbErr => {
        next(dbErr);
    });
}


const validateUpdatedQuantity=(req,res,next)=>{
     const currentQuantity=parseInt(req.body.quantity)+parseInt(req.body.previousQuantity)
     console.log(currentQuantity,"hgvfty")
    const query=`select stocklimit from stock`
    db.query(query).then(dbRes => {
        if(dbRes.rows[0].stocklimit>=(currentQuantity)){
        next()
        }
        else{
            res.json({
                error:true,
                stocklimit:dbRes.rows[0].stocklimit
            })
        }
    }).catch(dbErr => {
        next(dbErr);
    });
}
const getStockQuantity=(req,res,next)=>{
    const query=`select quantity from investorstock where stockcode='${req.params.stockcode}'`;
    // console.log("gdbqhdgv",req.body.quantity)
    db.query(query).then(dbRes =>{
            res.json({
                error:true,
                  quantity:dbRes.rows[0].quantity
            })
        
    }).catch(dbErr => {
        next(dbErr);
    });
}

const addQuantity=(req,res,next)=>{
    console.log(req.body.previousQuantity,"hfg",req.body.quantity)
    const updateQuery = `
    UPDATE investorstock
    SET 
        
        quantity=${req.body.previousQuantity }+ ${req.body.quantity}
       
    WHERE stockcode='${req.params.stockcode}'
`;
db.query(updateQuery).then(dbRes => {
    console.log(dbRes.rows)
    res.json({
        error: false,
        message: 'Stock details updated successfully'
    });
}).catch(dbErr => {
    console.log("here")
    next(dbErr);
});
}
const addBuyingStock = (req, res, next) => {
    const query = `
        INSERT INTO investorstock
        VALUES (
            '${req.body.investorid}', 
            '${req.body.ownername}',
            '${req.body.stockcode}', 
            '${req.body.name}',
            ${req.body.price},
            '${req.body.buydate}',
            ${req.body.quantity}
               )`;
            console.log(req.body)
    db.query(query).then(dbRes => {
        res.json({
            error: false,
            data: dbRes.rows
        });
    }).catch(dbErr => {
        next(dbErr);
    });
}

const getBuyingStock = (req, res, next) => {
    console.log("hello",req.params.investorid)
    const query = `SELECT * FROM investorstock where investorid='${req.params.investorid}'`;
    db.query(query).then(dbRes => {
        res.json({
            error: false,
            stocks: dbRes.rows
        });
    }).catch(dbErr => {
        console.log("next error")
        next(dbErr);
    });
}

const AllInvestorDetails = (req, res, next) => {
    console.log('kdnk',req)
    const query = 'SELECT * FROM investorstock'
    db.query(query).then(dbRes => {
        res.json({
            error: false,
            stocks: dbRes.rows,
            message:"investors"
        });
    }).catch(dbErr => {
        console.log("next error")
        next(dbErr);
    });
}


const validateQuantityForSell=(req,res,next)=>{

    const query=`select quantity from investorstock`
    db.query(query).then(dbRes => {
        if(dbRes.rows[0].quantity>=req.body.quantity){
        next()
        }
        else{
            res.json({
                error:true,
                stocklimit:dbRes.rows[0].quantity
            })
        }
    }).catch(dbErr => {
        next(dbErr);
    });
}
const sellStock = (req, res, next) => {
    const updateQuery = `
        UPDATE investorstock
        SET 
            
            quantity=${req.body.previousQuantity-req.body.quantity}
           
        WHERE stockcode='${req.params.stockcode}'
    `;
    db.query(updateQuery).then(dbRes => {
        console.log(dbRes.rows)
        res.json({
            error: false,
            message: 'Stock details updated successfully'
        });
    }).catch(dbErr => {
        console.log("here")
        next(dbErr);
    });
}


module.exports = {
    checkStock,
    getAllStock,
    getAllStockById,
    addStock,
    updateStock,
    deleteStock,
    validateBuyingLimit,
    validateUpdatedQuantity,
    getStockQuantity,
    addQuantity,
    addBuyingStock,
    getBuyingStock,
    validateQuantityForSell,
    sellStock,
    AllInvestorDetails
};