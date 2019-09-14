require('./models/db');

const express = require('express');
const bodyparser = require('body-parser');
const session = require('express-session');
const cors = require('cors');

const loginController = require('./controllers/loginController');
const transactionsController = require('./controllers/transactionsController');

const app = express();

app.use(cors());

app.use(bodyparser.urlencoded({
    extended: true
}));
app.use(bodyparser.json());

app.use(session({
    secret: "$2b$10$6q.h9jwVlCdwEYY1UjrbnOktE1VguuooPhG3XQTehq8qGC5CSvr42",
    resave: true,
    saveUninitialized: true
}));

app.listen(3000, () => {
    console.log('Express server started at port : 3000');
});

app.use('/', loginController);
app.use('/transactions', transactionsController);

// Route not found (404)
app.use(function(err, req) {
    req.send({
        code: 404
    });
});

// Any error 500
app.use(function(err, req) {
    req.send({
        code: 500
    });
});


