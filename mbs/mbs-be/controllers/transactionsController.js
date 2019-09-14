const express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
const Transaction = mongoose.model('Transaction');
const User = mongoose.model('User');

router.post('/all', (req, res) => {
    User.findOne({_token: req.body._token}, (err, user) => {
        if (err) {
            res.send({"code" : 500});
        }
        else if (!user) {
            res.send({"code" : 401});
        }
        else {
            Transaction.find( {$or:[{'from': req.body.email}, {'to': req.body.email}]} , (err, doc) => {
                if (!err) {
                    res.send({"data" : doc});
                }
                else {
                    res.send({"error" : 'Error in retrieving transactions :' + err});
                }
            });
        }
    });
});

router.post('/payment', (req, res) => {
    User.findOne({_token: req.body._token}, (err, user) => {
        if (err) {
            res.send({"code" : 500});
        }
        else if (!user) {
            res.send({"code" : 401});
        }
        else {
            let transaction = new Transaction();
            transaction.from = req.body.sender;
            transaction.to = ( typeof req.body.receiver === 'undefined' || req.body.receiver === req.body.sender ) ? req.body.sender : req.body.receiver;
            transaction.tnxId = generateTaxId().toUpperCase();
            transaction.amount = req.body.amount;
            transaction.save((err) => {
                if (!err){
                    res.send({"code" : 200});
                }
                else {
                    res.send(err);
                }
            });
        }
    });
});

function generateTaxId(){
    function chr4(){
        return Math.random().toString(16).slice(-4);
    }
    return chr4() + chr4() +
        '-' + chr4() +
        '-' + chr4() +
        '-' + chr4() +
        '-' + chr4() + chr4() + chr4();
}

module.exports = router;
