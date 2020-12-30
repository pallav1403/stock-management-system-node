const db = require('../util/database');
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcryptjs');
const checkInvestor= (req, res, next) => {
    
    const checkAvailability = `
        SELECT * FROM users
        WHERE user_id ='${req.params.user_id}'
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

const getAllInvestor= (req, res, next) => {
    const query = `SELECT * FROM users where role='investor'`;
    db.query(query).then(dbRes => {
        res.json({
            error: false,
            users: dbRes.rows
        });
    }).catch(dbErr => {
        next(dbErr);
    });
}

const getAllInvestorById = (req, res, next) => {
    
    const query = `SELECT * FROM users where user_id='${req.params.user_id}'`;
    db.query(query).then(dbRes => {
        res.json({                               
            error: false,
            users: dbRes.rows
        });
    }).catch(dbErr => {
        console.log("next error")
        next(dbErr);
    });
}
const addInvestor = (req, res, next) => {
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(req.body.password, salt);
    const query = `
        INSERT INTO users
        VALUES (
            '${uuidv4()}', 
            '${req.body.name}',
            '${req.body.email}',
            '${hashedPassword}',
            ${req.body.phone},
            'investor'
            
            )`;
    db.query(query).then(dbRes => {
        res.json({
            error: false,                      
            data: dbRes.rows
        });
    }).catch(dbErr => {
        next(dbErr);
    });
}

const updateInvestor = (req, res, next) => {
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(req.body.password, salt);
    console.log(req.params.user_id,req.body)
    const updateQuery = `
        UPDATE users
        SET 
            name='${req.body.name}',
            email='${req.body.email}',
            password='${hashedPassword}',
            phone=${req.body.phone}
        WHERE user_id='${req.params.user_id}'
    `;
    db.query(updateQuery).then(dbRes => {
        console.log(dbRes.rows)
        res.json({
            error: false,
            message: 'user details updated successfully'
        });
    }).catch(dbErr => {
        console.log("here")
        next(dbErr);
    });
}

const deleteInvestor = (req, res, next) => {
    const query = `
        DELETE FROM users
        WHERE user_id='${req.params.user_id}'
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

module.exports = {
    checkInvestor,
    getAllInvestor,
    getAllInvestorById,
    addInvestor,
    updateInvestor,
    deleteInvestor
};