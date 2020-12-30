const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const db = require('../util/database');
const config = require('../config/config.json');
const authCheck=require('../middleware/auth')
const checkEmailAvailability = (req, res, next) => {
    const query = `
        SELECT * FROM users
        WHERE email='${req.body.email}'
    `;
    db.query(query).then(dbRes => {
        if (dbRes.rows.length > 0) {
            res.json({
                error: true,
                message: 'Email already exists'
            });
        } else {
            next();
        }
    }).catch(dbErr => {
        next(dbErr);
    });
}

router.post('/register', checkEmailAvailability, (req, res, next) => {
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
            message: 'User registered successfully'
        });
    }).catch(dbErr => {
        next(dbErr);
    });
});

router.post('/login', (req, res, next) => {
    
    const query = `
        SELECT * FROM users
        WHERE email='${req.body.email}'
    `;
    db.query(query).then(dbRes => {
        if (dbRes.rows.length === 0) {
            res.json({
                error: true,
                message: 'Email not found. Please Register'
            });
        } else {
            const passwordMatched = bcrypt.compareSync(req.body.password, dbRes.rows[0].password);
            if (passwordMatched) {
                const payload = {
                    email: dbRes.rows[0].email,
                    name: dbRes.rows[0].name,
                    role: dbRes.rows[0].role,
                    user_id:dbRes.rows[0].user_id
                };
                const token = jwt.sign(payload, config.jwtSecret, {expiresIn: '1hr'});
                res.json({
                    error: false,
                    message: 'Login Successfull',
                    token: token,
                    role:dbRes.rows[0].role,
                    user_id:dbRes.rows[0].user_id,
                    name:dbRes.rows[0].name
                });
            } else {
                res.json({
                    error: true,
                    message: 'Invalid credentials'
                });
            }
        }
    }).catch(dbErr => {
        next(dbErr);
    })
});
//authCheck.checkAuth,.split(' ')[1];
   router.post('/tokenCheck', async (req,res,next)=>{
      
       try{
        const token = req.headers['authorization']
        console.log("token is:",token)
        if(!token) return res.json(false);
        const verify=jwt.verify(token, config.jwtSecret);
        if(!verify) return res.json(false);
        else{
        return res.json(true)}
       }
       catch(err){
            res.json({error:err.message})
       }    
   })
router.get('/getUser',authCheck.checkAuth,(req,res,next)=>{
           console.log(req.user)
           const query = `SELECT * FROM users where user_id='${req.user}'`;
           db.query(query).then(dbRes => {
               res.json({                               
                   error: false,
                   users: dbRes.rows
               });
            //    console.log(users)
           }).catch(dbErr => {
               console.log("next error")
               next(dbErr);
           });
           })

module.exports = router;



                          



 