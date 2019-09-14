const express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
const User = mongoose.model('User');
const bcrypt = require('bcrypt');

router.post('/login', function(req, res){
    if(typeof req.session.user === 'undefined') {
        if (!req.body.email || !req.body.password) {
            res.send({"error": "Please enter both email and password"});
        } else {
            User.findOne({email: req.body.email}, function (err, user) {
                if (err) {
                    res.send({"error": "Some error occurred fetching user"});
                } else if (!user) {
                    res.send({"error": "User not found"});
                } else {
                    const result = bcrypt.compareSync(req.body.password, user.password);
                    if (result === true) {
                        const newToken = bcrypt.hashSync(Math.random().toString(16), 10).toUpperCase();
                        User.findOneAndUpdate({ _id: user._id }, {_token: newToken}, { new: true }, (err) => {
                            if (!err) {
                                let UserUpdated = user;
                                UserUpdated._token = newToken;
                                res.send({"loggedInUser": UserUpdated});
                            }
                            else {
                                res.send({"error": "Token Generation Error. Please Retry"});
                            }
                        });
                    } else {
                        res.send({"error": "Invalid credentials"});
                    }
                }
            });
        }
    } else {
        res.send({"code" : 406});
    }
});

router.post('/logout', function(req, res){
    User.findOneAndUpdate({ _token: req.body._token }, {_token: null}, { new: true }, (err) => {
        if (!err) {
            req.session.destroy(function(){
                res.send({"code" : 201});
            });
        }
        else {
            res.send({"code" : 406});
        }
    });
});

router.post('/add-or-update-user', (req, res) => {
    if (typeof req.body._token === 'undefined'){
        insertRecord(req, res);
    }
    else{
        updateRecord(req, res);
    }
});

function insertRecord(req, res) {
    var user = new User();
    user.fullName = req.body.fullName;
    user.email = req.body.email;
    user.password = bcrypt.hashSync(req.body.password, 10);
    user.personalCode = req.body.personalCode;
    user._token = bcrypt.hashSync(Math.random().toString(16), 10).toUpperCase();
    user.save((err) => {
        if (!err){
            res.send({"code" : 200});
        }
        else {
            if (err.email === 'ValidationError') {
                res.send(handleValidationError(err, req.body));
            }
            else if (err.name === 'MongoError' && err.code === 11000) {
                res.send({"error" : 'This Email or Personal Code is already in use'});
            }
            else{
                res.send(err);
            }
        }
    });
}

function updateRecord(req, res) {
    req.body.password = bcrypt.hashSync(req.body.password, 10);
    User.findOneAndUpdate({ _token: req.body._token }, {fullName: req.body.fullName, password: req.body.password}, { new: true }, (err, doc) => {
        if (!err) {
            res.send({"data" : doc});
        }
        else {
            if (err.email === 'ValidationError') {
                res.send(handleValidationError(err, req.body));
            }
            else if (err.name === 'MongoError' && err.code === 11000) {
                res.send({"error" : 'This Email or Personal Code is already in use'});
            }
            else{
                res.send(err);
            }
        }
    });
}

function handleValidationError(err, body) {
    for (field in err.errors) {
        switch (err.errors[field].path) {
            case 'fullName':
                body['fullNameError'] = err.errors[field].message;
                break;
            case 'email':
                body['emailError'] = err.errors[field].message;
                break;
            case 'phone':
                body['phoneError'] = err.errors[field].message;
                break;
            default:
                break;
        }
    }
}

module.exports = router;
