const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const port = 8000;

const db = require('./util/database');

// routes
const stockRoutes = require('./routes/stock');
const resloginRoutes = require('./routes/reslogin');
const userRoutes = require('./routes/user');
const investorRoutes = require('./routes/investor');
// cors middleware
app.use(cors());

// bodyparser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/stocks', stockRoutes);
app.use('/manager', userRoutes);
app.use('/investor', investorRoutes);
app.use('/user', resloginRoutes)


// error handling middleware
app.use((err, req, res, next) => {
    res.send({
        error: true,
        message: 'Server Error',
        err: err
    });
});

app.listen(port, () => {
    console.log(`App is listening to port ${port}`);
});
